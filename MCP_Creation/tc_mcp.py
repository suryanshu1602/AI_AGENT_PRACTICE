"""
FastMCP server for VWO test cases — turns a flat CSV into an MCP-accessible
knowledge surface with tools, resources, and prompts for any LLM client.
"""

from __future__ import annotations

import csv
import io
import os
import re
from pathlib import Path

from fastmcp import FastMCP

# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

CSV_PATH = Path(__file__).parent / "testcases_vwo_100.csv"


def _load_csv() -> list[dict[str, str]]:
    """Read CSV and return a list of rows (as dicts)."""
    if not CSV_PATH.exists():
        return []
    with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def _save_csv(rows: list[dict[str, str]]) -> None:
    """Persist rows back to CSV."""
    if not rows:
        return
    fieldnames = list(rows[0].keys())
    with open(CSV_PATH, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


# In-memory cache (reloads on first access, stays hot after that)
_cache: list[dict[str, str]] | None = None


def _data() -> list[dict[str, str]]:
    global _cache
    if _cache is None:
        _cache = _load_csv()
    return _cache


# ---------------------------------------------------------------------------
# MCP server
# ---------------------------------------------------------------------------

mcp = FastMCP("VWO Test Cases")


# -- Tools ------------------------------------------------------------------


@mcp.tool()
def list_test_cases(limit: int = 50, offset: int = 0) -> str:
    """Return a paginated list of test cases."""
    rows = _data()
    chunk = rows[offset : offset + limit]
    if not chunk:
        return "No test cases found."
    return _fmt_table(chunk)


@mcp.tool()
def get_test_case(id: str) -> str:
    """Return a single test case by its ID (e.g. TC-00003)."""
    for row in _data():
        if row.get("ID", "").lower() == id.lower():
            return _fmt_row(row)
    return f"Test case {id!r} not found."


@mcp.tool()
def search_by_priority(priority: str) -> str:
    """Search test cases by priority (P0, P1, P2, P3)."""
    rows = [r for r in _data() if r.get("PRIORITY", "").lower() == priority.lower()]
    return _fmt_table(rows) if rows else f"No test cases with priority {priority!r}."


@mcp.tool()
def search_by_module(module: str) -> str:
    """Search test cases by module name (case-insensitive, partial match)."""
    q = module.lower()
    rows = [r for r in _data() if q in r.get("MODULE", "").lower()]
    return _fmt_table(rows) if rows else f"No test cases in module {module!r}."


@mcp.tool()
def search_by_label(label: str) -> str:
    """Search test cases by label (case-insensitive, partial match)."""
    q = label.lower()
    rows = [r for r in _data() if q in r.get("LABELS", "").lower()]
    return _fmt_table(rows) if rows else f"No test cases with label {label!r}."


@mcp.tool()
def search_by_owner(owner: str) -> str:
    """Search test cases by owner name (case-insensitive, partial match)."""
    q = owner.lower()
    rows = [r for r in _data() if q in r.get("OWNER", "").lower()]
    return _fmt_table(rows) if rows else f"No test cases owned by {owner!r}."


@mcp.tool()
def search_by_status(status: str) -> str:
    """Search test cases by status (Active, Draft, Archived, etc.)."""
    q = status.lower()
    rows = [r for r in _data() if q in r.get("STATUS", "").lower()]
    return _fmt_table(rows) if rows else f"No test cases with status {status!r}."


@mcp.tool()
def search_by_sprint(sprint: str) -> str:
    """Search test cases by sprint (case-insensitive, partial match)."""
    q = sprint.lower()
    rows = [r for r in _data() if q in r.get("SPRINT", "").lower()]
    return _fmt_table(rows) if rows else f"No test cases in sprint {sprint!r}."


@mcp.tool()
def search_test_cases(
    query: str = "",
    priority: str = "",
    module: str = "",
    label: str = "",
    owner: str = "",
    status: str = "",
    limit: int = 20,
) -> str:
    """Free-text + metadata search. All filters are optional and combined with AND."""
    rows = _data()

    if query:
        q = query.lower()
        rows = [
            r
            for r in rows
            if q in r.get("SUMMARY", "").lower()
            or q in r.get("STEPS", "").lower()
            or q in r.get("EXPECTED RESULT", "").lower()
        ]
    if priority:
        rows = [r for r in rows if r.get("PRIORITY", "").lower() == priority.lower()]
    if module:
        rows = [r for r in rows if module.lower() in r.get("MODULE", "").lower()]
    if label:
        rows = [r for r in rows if label.lower() in r.get("LABELS", "").lower()]
    if owner:
        rows = [r for r in rows if owner.lower() in r.get("OWNER", "").lower()]
    if status:
        rows = [r for r in rows if status.lower() in r.get("STATUS", "").lower()]

    rows = rows[:limit]
    return _fmt_table(rows) if rows else "No test cases match your criteria."


@mcp.tool()
def list_priorities() -> str:
    """List all distinct priorities in the dataset."""
    vals = sorted({r.get("PRIORITY", "") for r in _data() if r.get("PRIORITY")})
    return "\n".join(vals) if vals else "No data."


@mcp.tool()
def list_modules() -> str:
    """List all distinct modules in the dataset."""
    vals = sorted({r.get("MODULE", "") for r in _data() if r.get("MODULE")})
    return "\n".join(vals) if vals else "No data."


@mcp.tool()
def list_labels() -> str:
    """List all distinct labels in the dataset."""
    labels: set[str] = set()
    for r in _data():
        for lbl in r.get("LABELS", "").split("|"):
            lbl = lbl.strip()
            if lbl:
                labels.add(lbl)
    return "\n".join(sorted(labels)) if labels else "No data."


@mcp.tool()
def list_owners() -> str:
    """List all distinct owners in the dataset."""
    vals = sorted({r.get("OWNER", "") for r in _data() if r.get("OWNER")})
    return "\n".join(vals) if vals else "No data."


@mcp.tool()
def stats() -> str:
    """Return aggregate statistics about the test-case dataset."""
    rows = _data()
    if not rows:
        return "No data loaded."

    out = io.StringIO()
    out.write(f"Total test cases: {len(rows)}\n")
    out.write(f"Total modules: {len({r.get('MODULE', '') for r in rows})}\n")
    out.write(f"Total owners: {len({r.get('OWNER', '') for r in rows})}\n\n")

    # Priority breakdown
    from collections import Counter
    priorities = Counter(r.get("PRIORITY", "") for r in rows)
    out.write("By priority:\n")
    for p in ["P0", "P1", "P2", "P3"]:
        out.write(f"  {p}: {priorities.get(p, 0)}\n")

    # Status breakdown
    statuses = Counter(r.get("STATUS", "") for r in rows)
    out.write("\nBy status:\n")
    for s, c in statuses.most_common():
        out.write(f"  {s}: {c}\n")

    return out.getvalue()


@mcp.tool()
def add_test_case(
    summary: str,
    module: str,
    priority: str,
    severity: str = "Major",
    labels: str = "",
    preconditions: str = "",
    steps: str = "",
    expected_result: str = "",
    test_type: str = "Functional",
    owner: str = "",
    sprint: str = "",
    status: str = "Active",
) -> str:
    """Create a new test case and append it to the CSV."""
    rows = _data()

    # Auto-generate ID
    existing_ids = [int(r["ID"].split("-")[1]) for r in rows if r.get("ID", "").startswith("TC-")]
    next_num = max(existing_ids, default=0) + 1
    new_id = f"TC-{next_num:05d}"

    new_row = {
        "ID": new_id,
        "JIRA ID": "",
        "SUMMARY": summary,
        "MODULE": module,
        "PRIORITY": priority.upper(),
        "SEVERITY": severity,
        "LABELS": labels,
        "PRECONDITIONS": preconditions,
        "STEPS": steps,
        "EXPECTED RESULT": expected_result,
        "TEST TYPE": test_type,
        "OWNER": owner,
        "SPRINT": sprint,
        "STATUS": status,
    }

    rows.append(new_row)
    _save_csv(rows)
    # Update cache
    global _cache
    _cache = rows

    return f"✅ Test case {new_id} created successfully."


# -- Resources ---------------------------------------------------------------


@mcp.resource("testcases://all")
def all_test_cases() -> str:
    """Return all test cases as a formatted table."""
    return _fmt_table(_data())


@mcp.resource("testcases://stats")
def stats_resource() -> str:
    """Return dataset statistics."""
    return stats()


@mcp.resource("testcases://{test_case_id}")
def test_case_by_id(test_case_id: str) -> str:
    """Return a single test case by ID."""
    return get_test_case(test_case_id)


# -- Prompts -----------------------------------------------------------------


@mcp.prompt()
def review_test_case(test_case_id: str) -> str:
    """Ask the LLM to review a specific test case for quality."""
    tc = get_test_case(test_case_id)
    return (
        f"Review the following test case and suggest improvements:\n\n"
        f"{tc}\n\n"
        f"Check: clarity, completeness, edge cases, and missing preconditions."
    )


@mcp.prompt()
def suggest_regression_pack(module: str, max_cases: int = 10) -> str:
    """Ask the LLM to suggest a regression-test pack for a given module."""
    return (
        f"Based on the test cases in the '{module}' module, "
        f"suggest a regression test pack of up to {max_cases} test cases "
        f"that covers the most critical functionality. Prioritise P0/P1 cases."
    )


# -- Helpers -----------------------------------------------------------------


def _fmt_table(rows: list[dict[str, str]]) -> str:
    """Format rows as a human-readable table."""
    if not rows:
        return "No data."

    # Pick columns that fit in a terminal
    cols = ["ID", "PRIORITY", "MODULE", "SUMMARY", "STATUS"]
    widths = {c: max(len(c), max((len(r.get(c, "")) for r in rows), default=0)) for c in cols}
    # Cap summary width
    widths["SUMMARY"] = min(widths["SUMMARY"], 80)

    sep = " | "
    header = sep.join(c.ljust(widths[c]) for c in cols)
    rule = "-" * len(header)
    lines = [rule, header, rule]
    for r in rows:
        summary = r.get("SUMMARY", "")
        if len(summary) > 80:
            summary = summary[:77] + "..."
        row = sep.join(
            (summary if c == "SUMMARY" else r.get(c, "")).ljust(widths[c])
            for c in cols
        )
        lines.append(row)
    lines.append(rule)
    return "\n".join(lines)


def _fmt_row(row: dict[str, str]) -> str:
    """Format a single test case with all fields."""
    lines = []
    for k, v in row.items():
        if k == "STEPS":
            v = v.replace(" || ", "\n  ")
            lines.append(f"{k}:")
            lines.append(f"  {v}")
        else:
            lines.append(f"{k}: {v}")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    mcp.run()
