"""QA Bug Triage Agents — Each agent is a specialist."""

from crewai import Agent, Task, Crew, Process
from crewai import LLM
from dotenv import load_dotenv
import os
import requests

load_dotenv()


# Workaround: CrewAI 1.14.6 attaches a `cache_breakpoint` field to chat
# messages that Groq's OpenAI-compatible endpoint rejects. Strip it before
# every call.
class GroqLLM(LLM):
    def call(self, messages, *args, **kwargs):
        if isinstance(messages, list):
            cleaned = []
            for m in messages:
                if isinstance(m, dict):
                    m = {k: v for k, v in m.items() if k != "cache_breakpoint"}
                cleaned.append(m)
            messages = cleaned
        return super().call(messages, *args, **kwargs)


# Step 0 - Setup the Brain (Groq with a capable model)
groq_llm = GroqLLM(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_KEY"),
)


def extract_adf_text(adf) -> str:
    """Extract plain text from JIRA Atlassian Document Format (ADF)."""
    if adf is None:
        return "No description provided."
    lines = []

    def walk(node):
        if isinstance(node, dict):
            if node.get("type") == "text":
                lines.append(node.get("text", ""))
            if node.get("type") == "hardBreak":
                lines.append("\n")
            for child in node.get("content", []):
                walk(child)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(adf)
    return "".join(lines).strip()


def fetch_jira_ticket(bug_id: str) -> str:
    url = f"https://suryanshusrivastva16.atlassian.net/rest/api/3/issue/{bug_id}"
    r = requests.get(
        url,
        auth=(os.getenv("JIRA_EMAIL"), os.getenv("JIRA_API_TOKEN")),
        timeout=15,
    )
    data = r.json()
    f = data["fields"]

    # Build a structured bug report from JIRA fields
    desc_text = extract_adf_text(f.get("description"))

    # Try to get the bug environment from custom fields if available
    env_info = "Not specified"

    report = f"""Bug Title: {f['summary']}
Bug ID: {data['key']}
Status: {f['status']['name']}
Priority: {f['priority']['name'] if f.get('priority') else 'Not set'}
Reporter: {f['reporter']['displayName']}
Assignee: {f['assignee']['displayName'] if f.get('assignee') else 'Unassigned'}
Created: {f['created']}
Environment: {env_info}

Description:
{desc_text}
"""
    return report


# Fetch a specific bug from JIRA
BUG_ID = "AIT-2"  # "VWO Login - Invalid credentials error not displaying properly"
bug_report = fetch_jira_ticket(BUG_ID)
print(f"=== Fetched {BUG_ID} ===")
print(bug_report)


# Agent 1: Bug Triage Analyst
bug_analyst = Agent(
    role="Senior Bug Triage Analyst",
    goal="Accurately classify incoming bugs by severity, category, and priority",
    backstory="""You are a veteran QA engineer with 15 years of experience.
    You follow strict severity classification:
    - P0 (Blocker): System down, data loss, security breach
    - P1 (Critical): Major feature broken, no workaround
    - P2 (Major): Feature impaired, workaround exists
    - P3 (Minor): Cosmetic issue, minor inconvenience
    - P4 (Trivial): Enhancement request, typo
    You never inflate severity. You always justify your classification.""",
    llm=groq_llm,
    verbose=True,
    allow_delegation=False,
)

# Agent 2: Root Cause Investigator
root_cause_agent = Agent(
    role="Root Cause Analysis Specialist",
    goal="Identify the likely root cause and affected system components",
    backstory="""You are a debugging expert who thinks in system layers.
    You analyze bugs by tracing through: UI → API → Service → Database.
    You identify whether the issue is in frontend, backend, 
    infrastructure, or third-party integration. You suggest which 
    log files or monitoring dashboards to check first.""",
    llm=groq_llm,
    verbose=True,
    allow_delegation=False,
)

# Agent 3: Test Recommendation Agent
test_recommender = Agent(
    role="Test Strategy Advisor",
    goal="Recommend specific tests to validate the fix and prevent regression",
    backstory="""You are an SDET who designs test strategies.
    For every bug, you recommend:
    1. Immediate smoke tests to verify the fix
    2. Regression test cases to prevent recurrence
    3. Edge cases that should be added to the test suite
    You specify tests in Playwright TypeScript style when applicable.""",
    llm=groq_llm,
    verbose=True,
    allow_delegation=False,
)


# Task 1: Classify the bug
triage_task = Task(
    description=f"""Analyze and classify this bug report:
        
{bug_report}
        
Provide:
1. Severity (P0-P4) with justification
2. Category (UI, Functional, Performance, Security, Data)
3. Affected component/module
4. Business impact assessment
5. Recommended priority for sprint planning""",
    expected_output="""A structured triage report with severity, 
category, component, business impact, and sprint priority.""",
    agent=bug_analyst,
)

# Task 2: Investigate root cause (uses triage output as context)
root_cause_task = Task(
    description=f"""Based on the triage analysis, investigate the 
likely root cause of this bug:
    
{bug_report}
        
Provide:
1. Most likely root cause
2. System layer affected (UI/API/Service/DB/Infra)
3. Related components that might be impacted
4. Suggested investigation steps
5. Which logs/dashboards to check first""",
    expected_output="""A root cause analysis report with the probable 
cause, affected layer, related components, and investigation steps.""",
    agent=root_cause_agent,
    context=[triage_task],
)

# Task 3: Recommend tests (uses both previous outputs)
test_task = Task(
    description=f"""Based on the triage and root cause analysis, 
recommend test cases for this bug:
    
{bug_report}
        
Provide:
1. Verification test (confirm the fix works)
2. 3-5 regression test cases
3. Edge cases to add to the test suite
4. Suggested test automation approach (Playwright with Typescript)
5. Any load/performance tests if applicable""",
    expected_output="""A test recommendation report with verification 
tests, regression cases, edge cases, and automation approach.""",
    agent=test_recommender,
    context=[triage_task, root_cause_task],
)

crew = Crew(
    agents=[bug_analyst, root_cause_agent, test_recommender],
    tasks=[triage_task, root_cause_task, test_task],
    process=Process.sequential,
    verbose=True,
)

print("\n" + "=" * 60)
print("QA Bug Triage Crew -- Starting Analysis")
print(f"   Bug: {BUG_ID}")
print("=" * 60)

result = crew.kickoff()

print("\n" + "=" * 60)
print("FINAL TRIAGE REPORT")
print("=" * 60)
print(result)
