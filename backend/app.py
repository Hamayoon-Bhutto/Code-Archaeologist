# Main application entry point

import os

from dotenv import find_dotenv, load_dotenv
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

from src.ai_explainer import generate_project_summary, generate_readme
from src.graph_builder import build_dependency_graph, save_graph_html
from src.parser import scan_codebase, summarize_scan_results
from src.report_generator import (
    create_full_report,
    save_json_report,
    save_markdown_report,
    save_text_report,
)


# Local development mein .env load karega.
# Render par Environment Variables automatically os.environ mein milti hain.
load_dotenv(find_dotenv())


app = Flask(__name__)


# Apne Vercel frontend ko backend access ki permission.
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.route("/", methods=["GET"])
def home():
    """
    Check whether the backend is running.
    """
    return jsonify(
        {
            "message": "AI Legacy Code Archaeologist backend is running",
            "status": "ok",
        }
    )


@app.route("/health", methods=["GET"])
def health():
    """
    Health-check endpoint for Render.
    """
    return jsonify({"status": "healthy"}), 200


@app.route("/analyze", methods=["POST"])
def analyze_codebase():
    """
    Analyze a codebase folder available on the backend server.

    Important:
    A deployed Render server cannot access a folder located on the user's
    Windows computer, such as C:\\Users\\Name\\Downloads\\project.
    """

    data = request.get_json(silent=True)

    if not data:
        return jsonify(
            {
                "error": "Request body is missing. Please send JSON data.",
            }
        ), 400

    folder_path = data.get("folder_path")
    ai_provider = data.get("ai_provider", "local")

    if not folder_path:
        return jsonify(
            {
                "error": "folder_path is required.",
            }
        ), 400

    folder_path = os.path.abspath(folder_path)

    if not os.path.exists(folder_path):
        return jsonify(
            {
                "error": (
                    f"Folder path does not exist on the Render server: "
                    f"{folder_path}. A deployed backend cannot access a folder "
                    f"located on your personal computer."
                )
            }
        ), 400

    if not os.path.isdir(folder_path):
        return jsonify(
            {
                "error": f"The provided path is not a folder: {folder_path}",
            }
        ), 400

    try:
        project_name = os.path.basename(folder_path)

        print("1. Scanning codebase...", flush=True)
        scan_results = scan_codebase(folder_path)

        print("2. Creating statistics...", flush=True)
        stats = summarize_scan_results(scan_results)

        print("3. Building dependency graph...", flush=True)
        graph = build_dependency_graph(scan_results)
        graph_path = save_graph_html(graph)

        print("4. Generating architecture summary with AI...", flush=True)
        architecture_summary = generate_project_summary(
            scan_results,
            ai_provider=ai_provider,
        )

        print("5. Generating README with AI...", flush=True)
        readme_content = generate_readme(
            scan_results,
            project_name,
            ai_provider=ai_provider,
        )

        print("6. Creating final report...", flush=True)
        full_report = create_full_report(
            project_name=project_name,
            stats=stats,
            scan_results=scan_results,
            architecture_summary=architecture_summary,
            readme_content=readme_content,
            graph_path=graph_path,
        )

        print("7. Saving reports...", flush=True)
        json_path = save_json_report(full_report)
        readme_path = save_markdown_report(readme_content)
        summary_path = save_text_report(architecture_summary)

        graph_url = f"{request.host_url.rstrip('/')}/graph"
        report_url = f"{request.host_url.rstrip('/')}/report"
        readme_url = f"{request.host_url.rstrip('/')}/readme"

        print("DONE", flush=True)

        return jsonify(
            {
                "project_name": project_name,
                "files_analyzed": stats.get("files_analyzed", 0),
                "functions_found": stats.get("functions_found", 0),
                "classes_found": stats.get("classes_found", 0),
                "imports_found": stats.get("imports_found", 0),
                "architecture_summary": architecture_summary,
                "where_to_start": architecture_summary,
                "readme": readme_content,
                "file_summaries": scan_results,
                "graph_path": graph_url,
                "report_url": report_url,
                "readme_url": readme_url,
                "saved_files": {
                    "json_report": json_path,
                    "readme": readme_path,
                    "summary": summary_path,
                    "graph": graph_path,
                },
            }
        ), 200

    except Exception as error:
        print(f"Analysis error: {error}", flush=True)

        return jsonify(
            {
                "error": str(error),
            }
        ), 500


@app.route("/graph", methods=["GET"])
def get_graph():
    """
    Return the generated dependency graph.
    """
    graph_file = os.path.abspath("outputs/dependency_graph.html")

    if not os.path.exists(graph_file):
        return jsonify(
            {
                "error": (
                    "Graph has not been generated yet. "
                    "Please run /analyze first."
                )
            }
        ), 404

    return send_file(graph_file)


@app.route("/report", methods=["GET"])
def get_report():
    """
    Return the saved JSON report.
    """
    report_file = os.path.abspath("outputs/analysis_report.json")

    if not os.path.exists(report_file):
        return jsonify(
            {
                "error": (
                    "Report has not been generated yet. "
                    "Please run /analyze first."
                )
            }
        ), 404

    return send_file(
        report_file,
        as_attachment=True,
        download_name="analysis_report.json",
    )


@app.route("/readme", methods=["GET"])
def get_readme():
    """
    Return the generated README file.
    """
    readme_file = os.path.abspath("outputs/README_generated.md")

    if not os.path.exists(readme_file):
        return jsonify(
            {
                "error": (
                    "README has not been generated yet. "
                    "Please run /analyze first."
                )
            }
        ), 404

    return send_file(
        readme_file,
        as_attachment=True,
        download_name="README_generated.md",
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False,
    )
