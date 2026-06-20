from src.parser import scan_codebase, summarize_scan_results
from src.graph_builder import build_dependency_graph, save_graph_html
from src.ai_explainer import generate_project_summary, generate_readme
from src.report_generator import (
    create_full_report,
    save_json_report,
    save_markdown_report,
    save_text_report
)


project_path = "sample_codebase"
project_name = "Sample Codebase"

print("1. Scanning codebase...")
scan_results = scan_codebase(project_path)

print("2. Creating stats...")
stats = summarize_scan_results(scan_results)

print("3. Building graph...")
graph = build_dependency_graph(scan_results)
graph_path = save_graph_html(graph)

print("4. Generating architecture summary with AI...")
architecture_summary = generate_project_summary(scan_results)

print("5. Generating README with AI...")
readme_content = generate_readme(scan_results, project_name)

print("6. Creating full report object...")
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

print("\nDONE")
print(f"JSON report saved at: {json_path}")
print(f"README saved at: {readme_path}")
print(f"Summary saved at: {summary_path}")
print(f"Graph saved at: {graph_path}")