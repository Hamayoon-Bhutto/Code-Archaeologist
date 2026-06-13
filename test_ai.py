from src.parser import scan_codebase
from src.ai_explainer import explain_file, generate_project_summary

results = scan_codebase("sample_codebase")

print("Explaining first file...")
print(explain_file(results[0]))

print("\nGenerating project summary...")
print(generate_project_summary(results))