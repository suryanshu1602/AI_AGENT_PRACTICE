import os
import sys

os.environ["PYTHONIOENCODING"] = "utf-8"
os.environ["LITELLM_DROP_PARAMS"] = "TRUE"

import litellm

litellm.drop_params = True

# Monkey-patch to remove cache_breakpoint from messages (GROQ doesn't support it)
_original_completion = litellm.completion


def _patched_completion(**kwargs):
    messages = kwargs.get("messages", [])
    for msg in messages:
        if isinstance(msg, dict):
            msg.pop("cache_breakpoint", None)
    kwargs.pop("cache", None)
    return _original_completion(**kwargs)


litellm.completion = _patched_completion

from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process

load_dotenv()

groq_key = os.getenv("GROQ_KEY")
if not groq_key:
    raise ValueError("GROQ_KEY not found in .env")

llm_config = {
    "model": "groq/llama-3.3-70b-versatile",
    "temperature": 0.3,
    "api_key": groq_key,
}

researcher = Agent(
    role="Senior QA Research Analyst",
    goal="Research web application login pages and identify best practices, common test scenarios, and edge cases.",
    backstory="You are an experienced QA engineer who has tested hundreds of web applications. You know every edge case for login forms.",
    verbose=True,
    allow_delegation=False,
    llm=llm_config,
)

writer = Agent(
    role="QA Test Case Writer",
    goal="Write detailed, structured, and comprehensive test cases based on research findings.",
    backstory="You are a meticulous test case writer. Every test case you write is clear, actionable, and covers happy path, negative scenarios, and edge cases.",
    verbose=True,
    allow_delegation=False,
    llm=llm_config,
)

research_task = Task(
    description=(
        "Research the VWO (Visual Website Optimizer) login page at https://app.vwo.com. "
        "Identify the key elements of the login form, common test scenarios for login pages, "
        "and edge cases that should be covered. Focus on: "
        "1. Form fields and validation "
        "2. Authentication flow "
        "3. Session management "
        "4. Security considerations (password masking, session timeout) "
        "5. Error handling "
        "Provide a structured summary of findings."
    ),
    expected_output="A structured research summary covering login form elements, test scenarios, edge cases, and security considerations.",
    agent=researcher,
)

write_task = Task(
    description=(
        "Using the research findings, write comprehensive test cases for the VWO login page. "
        "Each test case must include: "
        "1. Test Case ID (TC001, TC002, ...) "
        "2. Description "
        "3. Pre-conditions "
        "4. Test Steps "
        "5. Expected Result "
        "Cover at least: valid login, invalid credentials, blank fields, remember me, "
        "password masking, session timeout, and edge cases."
    ),
    expected_output="A markdown file with numbered test cases, each containing Description, Steps, and Expected Result.",
    agent=writer,
    output_file="testcases_vwo.md",
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    verbose=True,
)

if __name__ == "__main__":
    result = crew.kickoff()
    print("\n=== DONE ===")
    print(result)
