import json
from src.parser import scan_codebase, summarize_scan_results

results = scan_codebase("sample_codebase")
summary = summarize_scan_results(results)

print(json.dumps(results, indent=2))
print(json.dumps(summary, indent=2))