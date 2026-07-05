# Playwright & JIRA MCP Setup for Visual Studio Code

## Task Results

### Task 1: VWO Login Error Test (May 20, 2026)

- **URL Tested:** https://app.vwo.com
- **Credentials Used:** `wronguser@example.com` / `wrongpassword123`
- **Error Message:** "Invalid email" (validation error)
- **JIRA Issue:** [AIT-3](https://suryanshusrivastva16.atlassian.net/browse/AIT-3)
- **Screenshots:** `mcp-1-navigate.png` to `mcp-5-final.png`

---

## Setup Guide

### Step 1: Install VS Code Extensions

1. Open Visual Studio Code
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Search for and install:
   - **Playwright** - Official Playwright test runner extension
   - **MCP (Model Context Protocol)** - Install the extension by "MCP" or "modelcontextprotocol"

### Step 2: Start MCP Server

Run the following to start the Playwright MCP server:
```bash
node start-mcp.js
```

### Step 3: Verify MCP is Active

1. Look for the MCP icon in the VS Code status bar (bottom left)
2. Open Command Palette and run "MCP: Show Server Status"

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `browser_navigate` | Navigate to a URL |
| `browser_click` | Click an element |
| `browser_type` | Type text into element |
| `browser_take_screenshot` | Take a screenshot |
| `browser_snapshot` | Capture accessibility snapshot |
| `browser_console_messages` | Get console output |

## Project Scripts

- `start-mcp.js` - Start Playwright MCP server
- `mcp-style-script.js` - VWO login test with error capture
- `screenshot.js` - Simple screenshot script
- `jira-api.js` - Create JIRA issues via API
- `create-bug.js` - Alternative JIRA issue creator

> **Note:** Set `JIRA_API_TOKEN` environment variable before running JIRA scripts.

## Screenshots

Screenshots from the test are saved as:
- `mcp-1-navigate.png` - Initial page
- `mcp-2-username.png` - After entering username
- `mcp-3-password.png` - After entering password
- `mcp-4-after-submit.png` - After clicking submit
- `mcp-5-final.png` - Final state