# AI Tools Practice

A collection of QA automation and AI-powered testing projects — Playwright MCP integration, Python fundamentals for QA engineers, and an AI-powered QA Copilot assistant.

## Projects

### QA Copilot

AI-powered QA assistant built with **Streamlit + LangChain + ChromaDB + Groq LLM**.

**Features:**
- **Chat Mode** — Ask questions about test cases, automation code, and JIRA tickets
- **Generate Mode** — Auto-generate Selenium or Playwright test code from requirements
- **Debug Mode** — Search knowledge base for relevant test cases and documentation
- **JIRA Mode** — Map JIRA tickets to test cases

**Architecture:**
- `qa-copilot/QA_Copilot/src/ui/app.py` — Streamlit UI with system status, vector store stats, file upload
- `qa-copilot/QA_Copilot/src/ingestion/` — Loaders for CSV, PDF, and automation source code
- `qa-copilot/QA_Copilot/src/retriever/vector_store.py` — ChromaDB persistent vector store (5 collections)
- `qa-copilot/QA_Copilot/src/llm/` — RAG chain + Groq LLM (llama-3.3-70b-versatile)
- `qa-copilot/QA_Copilot/config.py` — API keys, paths, chunk size config

**Setup:**
```
cd qa-copilot/QA_Copilot
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt groq
streamlit run src/ui/app.py --server.port 8501
```

**Data:**
- `data/csv/testcases_vwo.csv` — 5,000+ VWO test cases
- `data/csv/testcases_vwo_100.csv` — 100 sample test cases
- `data/pdf/` — Product requirements documentation
- `data/md/` — Bug reports

### Playwright MCP Basics

Playwright browser automation integrated with the Model Context Protocol (MCP). REST API testing, Postman-to-MCP server generation, and JIRA bug creation.

**Tech:** JavaScript, Python, Playwright, MCP SDK, Express, FastMCP

### Python Learning

Python fundamentals from a QA/test automation perspective — syntax, data types, operators, collections, API testing.

**Tech:** Python 3.11+, Requests

## Tech Stack

| Project | Languages | Frameworks | APIs |
|---|---|---|---|
| QA Copilot | Python | Streamlit, LangChain, ChromaDB | OpenAI, Groq |
| Playwright MCP Basics | JavaScript, Python | Playwright, MCP SDK, Express | JSONPlaceholder, JIRA, Imgur |
| Python Learning | Python | — | JSONPlaceholder |
