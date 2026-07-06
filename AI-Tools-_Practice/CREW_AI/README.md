# CREW_AI

A small CrewAI project for QA-focused automation in `CREW_AI`.
It demonstrates using `crewai` agents to analyze bug reports, generate triage summaries, and produce QA test case recommendations.

## Files

- `Building_QABugTriageCrew.py` — main workflow script that:
  - fetches a Jira bug ticket
  - runs a triage agent
  - runs a root cause analysis agent
  - runs a test recommendation agent
- `Research_Write_AI_Agent.py` — research and writing workflow for QA test cases and prevention guidance
- `testcases_vwo.md` — generated VWO login page test cases output
- `triage_AIT-2_report.md` — generated triage report output
- `.env` — local secrets and API credentials
- `.venv/` — Python virtual environment used for execution

## Requirements

This project runs inside the provided virtual environment at `.venv`.

Required Python packages:

- `crewai`
- `litellm`
- `python-dotenv`
- `requests`

## Setup

1. Open PowerShell in the `CREW_AI` folder.
2. Activate the virtual environment:
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
3. Install dependencies if needed:
   ```powershell
   .\.venv\Scripts\pip.exe install crewai litellm python-dotenv requests
   ```
4. Create or update `.env` with your credentials:
   ```text
   GROQ_KEY=your_groq_api_key
   JIRA_EMAIL=your_jira_email
   JIRA_API_TOKEN=your_jira_api_token
   ```

## Running

From the `CREW_AI` folder, run either workflow:

- Triage workflow:
  ```powershell
  .\.venv\Scripts\python.exe Building_QABugTriageCrew.py
  ```
- Research/write workflow:
  ```powershell
  .\.venv\Scripts\python.exe Research_Write_AI_Agent.py
  ```

## Output

- `Building_QABugTriageCrew.py` prints a final bug triage and test recommendation report.
- `Research_Write_AI_Agent.py` prints a QA research report and can be used to generate structured test case guidance.
- Generated artifacts are saved in `triage_AIT-2_report.md` and `testcases_vwo.md`.

## Customization

- To triage a different Jira ticket, update the hard-coded ticket ID in `Building_QABugTriageCrew.py`.
- To change the research prompt or output style, edit `Research_Write_AI_Agent.py`.

## Notes

- The scripts use a custom `GroqLLM` wrapper for compatibility with a Groq OpenAI-compatible endpoint.
- `python-dotenv` loads credentials from `.env` at runtime.
- Keep your `.env` file private and do not commit it to source control.
