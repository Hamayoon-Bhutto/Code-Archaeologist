from src.parser import scan_codebase
from src.graph_builder import build_dependency_graph, save_graph_html

results = scan_codebase("sample_codebase")

graph = build_dependency_graph(results)

path = save_graph_html(graph)

print(f"Graph saved at: {path}")