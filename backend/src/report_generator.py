# Report generator module
import os
import json
from datetime import datetime


def ensure_output_folder(output_folder="outputs"):
    """
    Makes sure the outputs folder exists.
    If it does not exist, this function creates it.
    """

    os.makedirs(output_folder, exist_ok=True)


def save_json_report(data, output_path="outputs/analysis_report.json"):
    """
    Saves complete analysis data into a JSON file.
    JSON is useful for dashboard and API responses.
    """

    ensure_output_folder(os.path.dirname(output_path))

    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

    return output_path


def save_markdown_report(content, output_path="outputs/README_generated.md"):
    """
    Saves AI-generated README or summary into a Markdown file.
    Markdown is useful because GitHub can display it nicely.
    """

    ensure_output_folder(os.path.dirname(output_path))

    with open(output_path, "w", encoding="utf-8") as file:
        file.write(content)

    return output_path


def create_full_report(project_name, stats, scan_results, architecture_summary, readme_content, graph_path):
    """
    Combines everything into one final report object.
    This report will later be returned by Flask backend.
    """

    report = {
        "project_name": project_name,
        "generated_at": datetime.now().isoformat(),
        "stats": stats,
        "architecture_summary": architecture_summary,
        "readme": readme_content,
        "graph_path": graph_path,
        "files": scan_results
    }

    return report


def save_text_report(content, output_path="outputs/architecture_summary.txt"):
    """
    Saves plain text summaries.
    """

    ensure_output_folder(os.path.dirname(output_path))

    with open(output_path, "w", encoding="utf-8") as file:
        file.write(content)

    return output_path