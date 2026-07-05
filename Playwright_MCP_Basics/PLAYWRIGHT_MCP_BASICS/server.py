from fastmcp import FastMCP
from typing import Optional

# ============================================================
# 1. Server Configuration
# ============================================================
mcp = FastMCP("TheTestingAcademy_Automation_Server")


# ============================================================
# 2. Tools (Exactly 20 Dummy Playwright Tools)
# ============================================================

@mcp.tool()
def browser_to_url(url: str) -> str:
    """Navigate the browser to a specified URL."""
    return f"Ok started: Navigating to {url}"


@mcp.tool()
def click_element(selector: str) -> str:
    """Click on a DOM element identified by the given selector."""
    return f"Ok started: Clicking element '{selector}'"


@mcp.tool()
def fill_input(selector: str, text: str) -> str:
    """Fill a text input field with the provided text."""
    return f"Ok started: Filling input '{selector}' with '{text}'"


@mcp.tool()
def take_screenshot(filename: Optional[str] = "screenshot.png") -> str:
    """Take a screenshot of the current page."""
    return f"Ok started: Taking screenshot saved as {filename}"


@mcp.tool()
def wait_for_selector(selector: str, timeout: int = 5000) -> str:
    """Wait for a DOM element to appear in the page."""
    return f"Ok started: Waiting for selector '{selector}' (timeout={timeout}ms)"


@mcp.tool()
def get_page_title() -> str:
    """Retrieve the title of the current page."""
    return "Ok started: Retrieving page title"


@mcp.tool()
def get_page_url() -> str:
    """Retrieve the current page URL."""
    return "Ok started: Retrieving current page URL"


@mcp.tool()
def select_option(selector: str, option: str) -> str:
    """Select an option from a <select> dropdown element."""
    return f"Ok started: Selecting option '{option}' from '{selector}'"


@mcp.tool()
def hover_element(selector: str) -> str:
    """Hover the mouse over a specific element."""
    return f"Ok started: Hovering over element '{selector}'"


@mcp.tool()
def press_key(key: str) -> str:
    """Press a keyboard key (e.g., Enter, Tab, Escape)."""
    return f"Ok started: Pressing key '{key}'"


@mcp.tool()
def scroll_into_view(selector: str) -> str:
    """Scroll an element into the visible viewport."""
    return f"Ok started: Scrolling '{selector}' into view"


@mcp.tool()
def get_text_content(selector: str) -> str:
    """Get the inner text of a DOM element."""
    return f"Ok started: Getting text content of '{selector}'"


@mcp.tool()
def get_attribute(selector: str, attribute: str) -> str:
    """Get the value of a specific attribute from an element."""
    return f"Ok started: Getting attribute '{attribute}' from '{selector}'"


@mcp.tool()
def check_checkbox(selector: str) -> str:
    """Check a checkbox element."""
    return f"Ok started: Checking checkbox '{selector}'"


@mcp.tool()
def uncheck_checkbox(selector: str) -> str:
    """Uncheck a checkbox element."""
    return f"Ok started: Unchecking checkbox '{selector}'"


@mcp.tool()
def upload_file(selector: str, file_path: str) -> str:
    """Upload a file by interacting with a file input element."""
    return f"Ok started: Uploading file '{file_path}' to '{selector}'"


@mcp.tool()
def evaluate_script(script: str) -> str:
    """Execute arbitrary JavaScript in the browser context."""
    return f"Ok started: Evaluating script: {script[:50]}..."


@mcp.tool()
def go_back() -> str:
    """Navigate back one page in the browser history."""
    return "Ok started: Navigating back"


@mcp.tool()
def go_forward() -> str:
    """Navigate forward one page in the browser history."""
    return "Ok started: Navigating forward"


@mcp.tool()
def reload_page() -> str:
    """Reload the current page."""
    return "Ok started: Reloading current page"


# ============================================================
# 3. Resources & Data (3 Text + 2 Structured = 5 total)
# ============================================================

@mcp.resource("artifacts://logs/latest")
def latest_logs() -> str:
    """Return raw string text logs of a mock test execution run."""
    return (
        "[2025-04-10 10:00:01] INFO  - Test suite 'Regression' started.\n"
        "[2025-04-10 10:00:02] INFO  - Navigating to https://example.com\n"
        "[2025-04-10 10:00:03] DEBUG - Selector '#login-btn' found\n"
        "[2025-04-10 10:00:04] INFO  - Clicking login button\n"
        "[2025-04-10 10:00:05] PASS  - Login form displayed\n"
        "[2025-04-10 10:00:06] FAIL  - Expected 'Welcome' text not found\n"
        "[2025-04-10 10:00:07] INFO  - Test execution completed.\n"
    )


@mcp.resource("config://env/staging")
def staging_config() -> str:
    """Return base configuration properties for the staging environment."""
    return (
        "base_url: https://staging.example.com\n"
        "api_endpoint: https://api.staging.example.com/v1\n"
        "timeout: 30000\n"
        "retry_attempts: 3\n"
        "headless: true\n"
        "viewport_width: 1280\n"
        "viewport_height: 720\n"
    )


@mcp.resource("reports://regression/summary")
def regression_summary() -> str:
    """Return a text overview summary of the regression test suite run."""
    return (
        "Regression Test Suite - Summary\n"
        "===============================\n"
        "Total Tests  : 51\n"
        "Passed       : 37\n"
        "Failed       : 14\n"
        "Pass Rate    : 72.55%\n"
        "Duration     : 12m 34s\n"
        "Environment  : Staging\n"
    )


@mcp.resource("data://suite/metrics")
def suite_metrics() -> str:
    """Return structured metrics for the test suite."""
    return {
        "total": 51,
        "passed": 37,
        "failed": 14,
        "pass_rate": 72.55,
    }


@mcp.resource("data://dom/schema")
def dom_schema() -> str:
    """Return a mockup JSON string representing a page element schema hierarchy."""
    return {
        "tag": "html",
        "children": [
            {
                "tag": "head",
                "children": [
                    {"tag": "title", "text": "Test Page"},
                    {"tag": "meta", "attrs": {"charset": "utf-8"}},
                ],
            },
            {
                "tag": "body",
                "children": [
                    {
                        "tag": "div",
                        "attrs": {"id": "main-container"},
                        "children": [
                            {"tag": "h1", "text": "Welcome"},
                            {
                                "tag": "form",
                                "attrs": {"id": "login-form"},
                                "children": [
                                    {"tag": "input", "attrs": {"id": "username", "type": "text"}},
                                    {"tag": "input", "attrs": {"id": "password", "type": "password"}},
                                    {"tag": "button", "attrs": {"id": "submit-btn"}, "text": "Login"},
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    }


# ============================================================
# 4. Prompts (Exactly 5 Prompt Templates)
# ============================================================

@mcp.prompt()
def generate_smoke_test(url: str) -> str:
    """Template asking to write a basic availability verification test."""
    return (
        f"Write a Playwright smoke test that verifies {url} is reachable and "
        f"responsive. The test should navigate to {url}, confirm the page loads "
        f"within 10 seconds, check that the title is non-empty, and log a pass/fail "
        "result. Provide the full Python code using the Playwright library."
    )


@mcp.prompt()
def debug_locator_failure(error_log: str) -> str:
    """Template to analyze stack traces and find broken selectors."""
    return (
        f"Analyze the following error log from a Playwright test run and identify "
        f"the root cause of the locator failure. Suggest a corrected selector and "
        f"explain why the original failed.\n\nError Log:\n{error_log}"
    )


@mcp.prompt()
def optimize_test_steps(raw_steps: str) -> str:
    """Template to refactor verbose step records down to 1-2 core steps."""
    return (
        f"Refactor the following verbose Playwright test steps into a concise "
        f"version with at most 2 core steps. Eliminate redundant waits, chained "
        f"selectors, and duplicated assertions, while preserving the test intent.\n\n"
        f"Raw Steps:\n{raw_steps}"
    )


@mcp.prompt()
def create_bug_report(failed_step: str) -> str:
    """Template to output a structured Jira bug format from a broken run."""
    return (
        f"Create a structured Jira bug report from the following failed Playwright "
        f"test step. Include fields: Summary, Environment, Steps to Reproduce, "
        f"Actual Result, Expected Result, and Severity.\n\n"
        f"Failed Step:\n{failed_step}"
    )


@mcp.prompt()
def suggest_wait_strategy(behavior: str) -> str:
    """Template to generate explicit element state wait models."""
    return (
        f"Based on the following observed page behavior, recommend an explicit "
        f"wait strategy (e.g., waitForSelector, waitForLoadState, waitForFunction) "
        f"in Playwright. Explain when to use each and provide code examples.\n\n"
        f"Observed Behavior:\n{behavior}"
    )


# ============================================================
# 5. Execution Entry Point
# ============================================================
if __name__ == "__main__":
    mcp.run(transport="sse", port=8778)
