export interface AnalysisResult {
  project_name: string;
  ai_provider?: string;
  ai_provider_used?: string;
  scan_time_seconds?: number;
  ai_time_seconds?: number;
  analysis_time_seconds?: number;
  files_analyzed: number;
  skipped_files_count?: number;
  warnings?: string[];
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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        folder_path: folderPath,
        ai_provider: aiProvider
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Analysis failed");
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Analysis timed out. Try a smaller folder or check backend logs.");
    }
    throw error;
  }
}