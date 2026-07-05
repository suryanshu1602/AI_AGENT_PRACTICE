"""
FastMCP server demonstrating resources, tools, and prompts.
"""

from __future__ import annotations

import json

from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")


# -- Resources ---------------------------------------------------------------


@mcp.resource("resource://greeting")
def greeting() -> str:
    """Return a simple greeting string."""
    return "Hello from FastMCP Resources!"


@mcp.resource("data://config")
def config() -> str:
    """Return application configuration as a JSON string."""
    return json.dumps({
        "theme": "dark",
        "version": "2.1.0",
        "features": ["search", "export", "analytics"],
    })


@mcp.resource("data://user/{user_id}")
def user(user_id: str) -> str:
    """Return user details for the given user_id as a JSON string."""
    return json.dumps({
        "id": user_id,
        "name": f"User {user_id}",
        "role": "viewer",
    })


# -- Tools -------------------------------------------------------------------


@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two integers together and return the result."""
    return a + b


# -- Prompts -----------------------------------------------------------------


@mcp.prompt()
def review_test_case(test_case: str) -> str:
    """Return a prompt asking the model to review a QA test case."""
    return (
        f"Please review the following QA test case for clarity, "
        f"coverage, and assertions:\n\n{test_case}\n\n"
        f"Suggest any improvements or missing edge cases."
    )


@mcp.prompt()
def summarize_config() -> str:
    """Return a prompt instructing the model to summarise the config resource."""
    return (
        "Fetch the resource data://config and summarise each field in one line."
    )


# -- Entrypoint ---------------------------------------------------------------

if __name__ == "__main__":
    mcp.run()
