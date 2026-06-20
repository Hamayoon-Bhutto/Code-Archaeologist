# Main application entry point
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

from src.parser import scan_codebase, summarize_scan_results
from src.graph_builder import build_dependency_graph, save_graph_html
from src.ai_explainer import generate_project_summary, generate_readme
from src.report_generator import (
    create_full_report,
    save_json_report,
    save_markdown_report,
    save_text_report
)
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    """
    Simple route to check if backend is running.
    """

    return jsonify({
        "message": "AI Legacy Code Archaeologist backend is running",
        "status": "ok"
    })


@app.route("/analyze", methods=["POST"])
def analyze_codebase():
    """
    Main API endpoint.

    It receives a folder path from frontend,
    scans the codebase,
    builds graph,
    generates AI summaries,
    saves reports,
    and returns everything as JSON.
    """

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is missing. Please send JSON data."
        }), 400

    folder_path = data.get("folder_path")

    if not folder_path:
        return jsonify({
            "error": "folder_path is required."
        }), 400

    if not os.path.exists(folder_path):
        return jsonify({
            "error": f"Folder path does not exist: {folder_path}"
        }), 400

    try:
        project_name = os.path.basename(os.path.abspath(folder_path))

        ai_provider = data.get("ai_provider", "local")

        print("1. Scanning codebase...")
        scan_results = scan_codebase(folder_path)

        print("2. Creating statistics...")
        stats = summarize_scan_results(scan_results)

        print("3. Building dependency graph...")
        graph = build_dependency_graph(scan_results)
        graph_path = save_graph_html(graph)

        print("4. Generating architecture summary with AI...")
        architecture_summary = generate_project_summary(scan_results, ai_provider=ai_provider)

        print("5. Generating README with AI...")
        readme_content = generate_readme(scan_results, project_name, ai_provider=ai_provider)

        print("6. Creating final report...")
        full_report = create_full_report(
            project_name=project_name,
            stats=stats,
            scan_results=scan_results,
            architecture_summary=architecture_summary,
            readme_content=readme_content,
            graph_path=graph_path
        )

        print("7. Saving reports...")
        json_path = save_json_report(full_report)
        readme_path = save_markdown_report(readme_content)
        summary_path = save_text_report(architecture_summary)

        print("DONE")

        return jsonify({
            "project_name": project_name,
            "files_analyzed": stats["files_analyzed"],
            "functions_found": stats["functions_found"],
            "classes_found": stats["classes_found"],
            "imports_found": stats["imports_found"],
            "architecture_summary": architecture_summary,
            "where_to_start": architecture_summary,
            "readme": readme_content,
            "file_summaries": scan_results,
            "graph_path": "http://localhost:5000/graph",
            "saved_files": {
                "json_report": json_path,
                "readme": readme_path,
                "summary": summary_path,
                "graph": graph_path
            }
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


@app.route("/graph")
def get_graph():
    """
    Opens the generated dependency graph in browser/dashboard.
    """

    graph_file = "outputs/dependency_graph.html"

    if not os.path.exists(graph_file):
        return jsonify({
            "error": "Graph has not been generated yet. Please run /analyze first."
        }), 404

    return send_file(graph_file)


@app.route("/report")
def get_report():
    """
    Returns the saved JSON report.
    """

    report_file = "outputs/analysis_report.json"

    if not os.path.exists(report_file):
        return jsonify({
            "error": "Report has not been generated yet. Please run /analyze first."
        }), 404

    return send_file(report_file)


@app.route("/readme")
def get_readme():
    """
    Returns the generated README markdown file.
    """

    readme_file = "outputs/README_generated.md"

    if not os.path.exists(readme_file):
        return jsonify({
            "error": "README has not been generated yet. Please run /analyze first."
        }), 404

    return send_file(readme_file)


if __name__ == "__main__":
    app.run(debug=True, port=5000)