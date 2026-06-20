# AI explainer module
import ollama


def ask_local_ai(prompt, model="codellama"):
    """
    Sends a prompt to local Ollama model and returns the AI response.
    """
    try:
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
    except Exception as e:
        return f"Error connecting to local AI (Ollama): {str(e)}. Make sure Ollama is running and the model '{model}' is installed."

def ask_ai(prompt, ai_provider="local"):
    """
    Routes the prompt to the selected AI provider.
    """
    if ai_provider == "gemini":
        try:
            import os
            import google.generativeai as genai
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                return "Error: GEMINI_API_KEY environment variable is not set. Please add it to the backend environment or .env file to use Gemini API."
            
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(prompt)
            return response.text
        except ImportError:
            return "Error: 'google-generativeai' package is not installed. Please run 'pip install google-generativeai'."
        except Exception as e:
            return f"Error calling Gemini API: {str(e)}"
    
    return ask_local_ai(prompt)

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


def generate_project_summary(scan_results, ai_provider="local"):
    """
    Generates a full project summary using the selected AI provider.
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

    return ask_ai(prompt, ai_provider)


def generate_readme(scan_results, project_name="Legacy Code Project", ai_provider="local"):
    """
    Generates README content using the selected AI provider.
    """

    summary = generate_project_summary(scan_results, ai_provider)

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

    return ask_ai(prompt, ai_provider)