# VWO Test Cases — FastMCP Server

Turns `testcases_vwo_100.csv` (100 VWO test cases) into an MCP-accessible knowledge surface.

## Quick Start

```bash
# Activate virtual environment (create one if needed)
python -m venv venv
venv\Scripts\activate
pip install fastmcp

# Run the server
python tc_mcp.py
```

This starts a **stdio** MCP server. Connect any MCP client (Claude Desktop, Cursor, Claude Code, `npx @modelcontextprotocol/inspector`).

## MCP Inspector

```bash
npx @modelcontextprotocol/inspector python tc_mcp.py
```

Opens `http://localhost:6274`.

## Exposed Surface

| Type | Name |
|------|------|
| Tool | `list_test_cases(limit, offset)` |
| Tool | `get_test_case(id)` |
| Tool | `search_by_priority(priority)` |
| Tool | `search_by_module(module)` |
| Tool | `search_by_label(label)` |
| Tool | `search_by_owner(owner)` |
| Tool | `search_by_status(status)` |
| Tool | `search_by_sprint(sprint)` |
| Tool | `search_test_cases(query, priority, module, label, owner, status, limit)` |
| Tool | `list_priorities` / `list_modules` / `list_labels` / `list_owners` |
| Tool | `stats()` |
| Tool | `add_test_case(...)` |
| Resource | `testcases://all` / `testcases://stats` / `testcases://{id}` |
| Prompt | `review_test_case(id)` / `suggest_regression_pack(module, max_cases)` |

## Claude Desktop Config

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "vwo-test-cases": {
      "command": "python",
      "args": ["C:\\path\\to\\tc_mcp.py"],
      "cwd": "C:\\path\\to\\MCP_Creation"
    }
  }
}
```

## Data File

`testcases_vwo_100.csv` — 100 rows, columns: ID, JIRA ID, SUMMARY, MODULE, PRIORITY, SEVERITY, LABELS, PRECONDITIONS, STEPS, EXPECTED RESULT, TEST TYPE, OWNER, SPRINT, STATUS.
