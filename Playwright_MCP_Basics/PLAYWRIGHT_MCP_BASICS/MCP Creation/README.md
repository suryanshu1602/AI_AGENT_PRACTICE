# MCP Creation

A collection of MCP (Model Context Protocol) servers built with FastMCP for testing and prototyping.

## Files

- **`mcp.py`** — Original FastMCP server with resources (`resource://greeting`, `data://config`)
- **`dataserver_mcp.py`** — Extended FastMCP server with resources, tools (`add`), and prompts (`review_test_case`, `summarize_config`, `greet_user`, `user_report`, `analyze_config`)

## Usage

```bash
# Run via fastmcp CLI (HTTP mode)
fastmcp run dataserver_mcp.py:mcp --transport http --port 8765

# Debug with MCP Inspector
npx @modelcontextprotocol/inspector fastmcp run dataserver_mcp.py:mcp

# Run directly via Python (stdio mode)
python dataserver_mcp.py
```

> **Note:** Do not name the file `mcp.py` — it shadows the `mcp` Python package and causes import errors.
