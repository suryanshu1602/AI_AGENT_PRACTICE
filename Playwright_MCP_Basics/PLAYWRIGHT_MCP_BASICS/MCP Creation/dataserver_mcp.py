import json
from fastmcp import FastMCP

mcp = FastMCP(name="DataServer")

# --- Resources (data that can be read) ---

@mcp.resource("resource://greeting")
def get_greeting() -> str:
    """Provides a simple greeting message."""
    return "Hello from FastMCP Resources!"

@mcp.resource("data://config")
def get_config() -> str:
    """Provides application configuration as JSON."""
    return json.dumps({
        "theme": "dark",
        "version": "1.2.0",
        "features": ["tools", "resources"],
    })

@mcp.resource("user://{user_id}/profile")
def get_user_profile(user_id: str) -> str:
    """Returns a mock user profile for the given user ID."""
    return json.dumps({
        "id": user_id,
        "name": f"User {user_id}",
        "email": f"user{user_id}@example.com",
        "role": "viewer"
    })

# --- Prompts (templated messages for LLMs) ---

@mcp.prompt()
def greet_user(name: str) -> str:
    """Greet a user by name."""
    return f"Hello {name}! Welcome to the DataServer MCP."

@mcp.prompt()
def analyze_config() -> str:
    """Ask an LLM to analyze the current app configuration."""
    return """Please analyze the following application configuration and suggest improvements:

Current config:
- Theme: dark
- Version: 1.2.0
- Features: tools, resources

Provide recommendations for:
1. Additional features that would be valuable
2. Configuration optimizations
3. Security considerations"""

@mcp.prompt()
def user_report(user_id: str) -> str:
    """Generate a user activity report prompt for a given user ID."""
    return json.dumps({
        "task": "generate_report",
        "user_id": user_id,
        "sections": ["summary", "activity_log", "recommendations"],
        "format": "markdown"
    })
