# AI explainer module
import ollama


def ask_local_ai(prompt, model="codellama"):
    """
    Sends a prompt to local Ollama model and returns the AI response.
    """

    response = ollama.chat(
        model=model,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]


def explain_file(file_info):
    """
    Explains one Python file using local AI.
    """

    prompt = f"""
You are a senior software engineer explaining legacy code to a beginner.

File path:
{file_info["file_path"]}

Lines of code:
{file_info["lines"]}

Functions:
{file_info["functions"]}

Classes:
{file_info["classes"]}

Imports:
{file_info["imports"]}

Code preview:
{file_info["content_preview"]}

Please explain this file in simple words.

Return these sections:

1. What this file does
2. Important functions/classes
3. Any confusing or risky parts
4. How a new developer should read this file

Keep the answer simple and practical.
"""

    return ask_local_ai(prompt)


def generate_project_summary(scan_results):
    """
    Generates a full project summary using local AI.
    """

    files_text = ""

    for file in scan_results[:10]:
        files_text += f"""
File: {file["file_path"]}
Lines: {file["lines"]}
Functions: {file["functions"]}
Classes: {file["classes"]}
Imports: {file["imports"]}
"""

    prompt = f"""
You are a senior software architect.

Analyze this legacy Python project and explain it to a beginner developer.

Project files:
{files_text}

Return these sections:

# Project Overview
Explain what this project seems to do.

# Architecture Summary
Explain the main parts of the project.

# Key Files
List the important files and why they matter.

# Where To Start
Tell a new developer which file to read first and why.

# Risks / Warnings
Mention confusing parts, missing documentation, or possible problems.

Keep the explanation clear and useful.
"""

    return ask_local_ai(prompt)


def generate_readme(scan_results, project_name="Legacy Code Project"):
    """
    Generates README content using local AI.
    """

    summary = generate_project_summary(scan_results)

    prompt = f"""
Write a professional README.md for this project.

Project name:
{project_name}

Project analysis:
{summary}

Include these sections:

# {project_name}
## Overview
## Features
## Project Structure
## How to Run
## Important Files
## Where To Start
## Developer Notes

Make it clean and helpful.
"""

    return ask_local_ai(prompt)