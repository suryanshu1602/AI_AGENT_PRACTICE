# AI Tools Practice

A collection of QA automation and AI-powered testing projects.

## Projects

### [MCP_Creation](./MCP_Creation/)
FastMCP server that converts CSV test cases into MCP-accessible tools for AI agents. Exposes search, filter, and stats tools over the Model Context Protocol.

**Tech:** Python, FastMCP, pandas

### [Playwright_MCP_Basics](./Playwright_MCP_Basics/)
Playwright browser automation integrated with the Model Context Protocol (MCP). Includes REST API testing, Postman-to-MCP server generation, JIRA bug creation, and automation scripts.

**Tech:** JavaScript, Python, Playwright, MCP SDK, Express, FastMCP

### [QA Copilot](./QA%20Copilot/)
An AI-powered QA assistant built with Streamlit that searches test cases, generates Selenium/Playwright automation code, maps JIRA tickets, and debugs failures using RAG (Retrieval-Augmented Generation).

**Tech:** Python, Streamlit, LangChain, ChromaDB, Groq LLM, OpenAI

### [Python_Learning](./Python_Learning/)
Python fundamentals from a QA/test automation engineer's perspective — covers syntax, data types, operators, string methods, collections, naming conventions, and API testing.

**Tech:** Python 3.11+, Requests

## Project Structure

```
AI-Tools-_Practice/
├── MCP_Creation/              # FastMCP test case server
├── Playwright_MCP_Basics/     # Browser automation + MCP integration
├── Python_Learning/           # Python fundamentals for QA engineers
├── QA Copilot/                # RAG-based AI QA assistant
├── testcases_vwo.csv          # 5,000+ VWO test cases (shared data)
└── README.md
```

## Getting Started

Each project has its own setup instructions in its respective README. Navigate to the project folder and follow the steps there.

```bash
cd MCP_Creation
cd Playwright_MCP_Basics
cd "QA Copilot"
```
