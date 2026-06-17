export interface AnalysisResult {
  project_name: string;
  ai_provider?: string;
  ai_provider_used?: string;
  analysis_time_seconds?: number;
  files_analyzed: number;
  functions_found: number;
  classes_found: number;
  imports_found: number;
  architecture_summary: string;
  where_to_start: string;
  risks?: string;
  readme: string;
  file_summaries: any[];
  graph_path: string;
  saved_files?: {
    json_report?: string;
    readme?: string;
    summary?: string;
    graph?: string;
  };
}

export async function analyzeCodebase(folderPath: string, aiProvider: string): Promise<AnalysisResult> {
  const response = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      folder_path: folderPath,
      ai_provider: aiProvider
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Analysis failed");
  }

  return data;
}