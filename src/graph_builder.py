import os
import networkx as nx
from pyvis.network import Network


def build_dependency_graph(scan_results):
    """
    Creates a graph where each file is a node.
    Imports become connections between files/modules.
    """

    graph = nx.DiGraph()

    for file_info in scan_results:
        file_path = file_info["file_path"]

        graph.add_node(
            file_path,
            title=file_path,
            lines=file_info["lines"],
            functions=len(file_info["functions"]),
            classes=len(file_info["classes"])
        )

        for imported_module in file_info["imports"]:
            graph.add_node(imported_module, title=imported_module)
            graph.add_edge(file_path, imported_module)

    return graph


def save_graph_html(graph, output_path="outputs/dependency_graph.html"):
    """
    Saves an interactive graph as an HTML file.
    """

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    net = Network(
        height="750px",
        width="100%",
        directed=True,
        bgcolor="#0f172a",
        font_color="#ffffff"
    )

    for node, data in graph.nodes(data=True):
        label = str(node)
        size = 15 + data.get("functions", 0) * 3 + data.get("classes", 0) * 4

        net.add_node(
            node,
            label=label,
            title=f"{label}<br>Functions: {data.get('functions', 0)}<br>Classes: {data.get('classes', 0)}",
            size=size
        )

    for source, target in graph.edges():
        net.add_edge(source, target)

    net.save_graph(output_path)

    return output_path