"""Utilities for scanning a Python codebase.

The module walks a folder, reads every Python file it finds, and returns a
small structured summary for each file.
"""

from __future__ import annotations

import ast
import os
from pathlib import Path
from typing import Any


IGNORED_DIRECTORIES = {".git", "__pycache__", "node_modules", "venv", ".venv"}
PREVIEW_LINE_LIMIT = 15
PREVIEW_CHAR_LIMIT = 1500


def scan_codebase(folder_path: str) -> list[dict[str, Any]]:
    """Scan a folder and analyze every Python file we can reach."""

    base_path = Path(folder_path).resolve()
    results: list[dict[str, Any]] = []

    for file_path in _iter_python_files(base_path):
        results.append(analyze_python_file(file_path, base_path))

    return results


def _iter_python_files(base_path: Path):
    """Yield source files under *base_path* while skipping common noise folders."""
    extensions = {".py", ".js", ".ts", ".java", ".go", ".php", ".rb", ".txt", ".md", ".json", ".html", ".css"}

    for root, dirs, files in os.walk(base_path):
        # Mutating ``dirs`` in place tells ``os.walk`` which folders to skip.
        dirs[:] = [
            directory
            for directory in dirs
            if not directory.startswith(".") and directory not in IGNORED_DIRECTORIES
        ]

        for file_name in files:
            if any(file_name.endswith(ext) for ext in extensions):
                yield Path(root) / file_name

def analyze_python_file(file_path: str | Path, base_path: str | Path) -> dict[str, Any]:
    """Read one source file and extract details."""

    file_path = Path(file_path).resolve()
    base_path = Path(base_path).resolve()

    content, read_error = _read_text_file(file_path)
    lines = content.splitlines()

    collector = _PythonFileCollector()
    parse_error = None

    if content and file_path.suffix == ".py":
        try:
            collector.visit(ast.parse(content))
        except SyntaxError as exc:
            parse_error = _format_syntax_error(exc)

    relative_path = _relative_path(file_path, base_path)

    result = {
        "file_path": relative_path,
        "absolute_path": str(file_path),
        "lines": len(lines),
        "line_count": len(lines),
        "functions": collector.functions,
        "classes": collector.classes,
        "imports": collector.imports,
        "content_preview": _build_content_preview(lines),
    }

    if read_error:
        result["read_error"] = read_error

    if parse_error:
        result["parse_error"] = parse_error

    return result


def summarize_scan_results(scan_results: list[dict[str, Any]]) -> dict[str, int]:
    """Create overall project statistics from the per-file scan output."""

    total_files = len(scan_results)
    total_functions = sum(len(file_info.get("functions", [])) for file_info in scan_results)
    total_classes = sum(len(file_info.get("classes", [])) for file_info in scan_results)
    total_imports = sum(len(file_info.get("imports", [])) for file_info in scan_results)

    return {
        "files_analyzed": total_files,
        "functions_found": total_functions,
        "classes_found": total_classes,
        "imports_found": total_imports,
    }


def _read_text_file(file_path: Path) -> tuple[str, str | None]:
    """Read a file as text and return the content plus any read error message."""

    try:
        return file_path.read_text(encoding="utf-8", errors="replace"), None
    except OSError as exc:
        return "", str(exc)


def _relative_path(file_path: Path, base_path: Path) -> str:
    """Return a clean relative path for display."""

    try:
        return str(file_path.relative_to(base_path))
    except ValueError:
        return os.path.relpath(file_path, base_path)


def _build_content_preview(lines: list[str]) -> str:
    """Build a short preview from the first few lines of a file."""

    if not lines:
        return ""

    preview = "\n".join(lines[:PREVIEW_LINE_LIMIT])
    if len(lines) > PREVIEW_LINE_LIMIT:
        preview += "\n..."

    if len(preview) > PREVIEW_CHAR_LIMIT:
        preview = preview[: PREVIEW_CHAR_LIMIT - 3] + "..."

    return preview


def _format_syntax_error(error: SyntaxError) -> str:
    """Format a syntax error so the caller can display a helpful message."""

    location = []
    if error.lineno is not None:
        location.append(f"line {error.lineno}")
    if error.offset is not None:
        location.append(f"column {error.offset}")

    location_text = f" ({', '.join(location)})" if location else ""
    return f"{error.msg}{location_text}"


class _PythonFileCollector(ast.NodeVisitor):
    """Collect functions, classes, and imports from a Python AST."""

    def __init__(self) -> None:
        self.functions: list[dict[str, Any]] = []
        self.classes: list[dict[str, Any]] = []
        self.imports: list[str] = []
        self._scope_stack: list[str] = []

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        self._record_function(node, is_async=False)

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> None:
        self._record_function(node, is_async=True)

    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        self.classes.append(self._build_item(node.name, node.lineno, self._scope_stack))
        self._scope_stack.append(node.name)
        self.generic_visit(node)
        self._scope_stack.pop()

    def visit_Import(self, node: ast.Import) -> None:
        for alias in node.names:
            self.imports.append(self._format_import_name(alias.name, alias.asname))

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        module_name = self._format_module_name(node.module, node.level)

        for alias in node.names:
            imported_name = "*" if alias.name == "*" else alias.name
            self.imports.append(self._format_from_import(module_name, imported_name, alias.asname))

    def _record_function(self, node: ast.AST, is_async: bool) -> None:
        function_item = self._build_item(getattr(node, "name"), getattr(node, "lineno"), self._scope_stack)

        if is_async:
            function_item["async"] = True

        self.functions.append(function_item)
        self._scope_stack.append(getattr(node, "name"))
        self.generic_visit(node)
        self._scope_stack.pop()

    def _build_item(self, name: str, line_number: int, scope_stack: list[str]) -> dict[str, Any]:
        item: dict[str, Any] = {"name": name, "line": line_number}

        if scope_stack:
            item["qualname"] = ".".join([*scope_stack, name])

        return item

    def _format_import_name(self, module_name: str, alias_name: str | None) -> str:
        if alias_name:
            return f"import {module_name} as {alias_name}"

        return f"import {module_name}"

    def _format_from_import(self, module_name: str, imported_name: str, alias_name: str | None) -> str:
        if alias_name:
            return f"from {module_name} import {imported_name} as {alias_name}"

        return f"from {module_name} import {imported_name}"

    def _format_module_name(self, module_name: str | None, level: int) -> str:
        prefix = "." * level
        if module_name:
            return f"{prefix}{module_name}"
        return prefix or "."