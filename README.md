# Code Archaeologist Workspace

<p align="center">
  <img src="src/screenshots/1-overview.png" alt="Overview" width="800">
</p>
<p align="center">
  <img src="src/screenshots/2-file-explorer.png" alt="File Explorer" width="800">
</p>
<p align="center">
  <img src="src/screenshots/3-generated-documentation.png" alt="Generated Documentation" width="800">
</p>
<p align="center">
  <img src="src/screenshots/4-call-graph.png" alt="Call Graph" width="800">
</p>
<p align="center">
  <img src="src/screenshots/5-architecture-map.png" alt="Architecture Map" width="800">
</p>
<p align="center">
  <img src="src/screenshots/6-upload-insights.png" alt="Upload Insights" width="800">
</p>
<p align="center">
  <img src="src/screenshots/7-project-reports.png" alt="Project Reports" width="800">
</p>

<br />

<div align="center">
  <strong>Code Archaeologist</strong> is a powerful, AI-driven development tool designed to unearth insights from complex, legacy, or undocumented codebases. It automatically analyzes your code, builds interactive dependency graphs, and uses AI to generate comprehensive architecture summaries and developer documentation.
</div>

<br />

## 🌟 Key Features

- **Deep Codebase Scanning:** Instantly scans any local project folder to extract functions, classes, and import statements.
- **Interactive Dependency Graphs:** Automatically visualizes how different files, folders  and modules interact, making it easy to understand complex systems.
- **AI-Powered Architecture Summaries:** Leverages AI to read the scanned code and explain the architecture, pointing out entry points and potential risks (like circular dependencies).
- **Automated Documentation Generation:** Automatically writes highly detailed, professional `README.md` files for legacy projects that lack documentation.
- **Project Reports & Insights:** Exports complete JSON, Markdown, and Text reports of the analysis for offline viewing or integration.
- **Flexible AI Providers:** Supports both **Local AI** (via Ollama for privacy and offline use) and **Gemini API** for cloud-based and cloud base analysis.

## 🛠️ Tech Stack

Code Archaeologist is built as a modern monorepo:

- **Frontend:** React, TypeScript, Vite, TailwindCSS (Professional UI with Dark Mode).
- **Backend:** Python, Flask (Robust API for file parsing and AI integration).
- **AI Integrations:** Google Gemini API & Local LLMs via Ollama.

## 📂 Directory Structure

```text
/
├── backend/                  # Python Flask Backend
│   ├── src/                  # Code analysis parser, AI engine, graph builder
│   ├── outputs/              # Analysis output directory (reports, graphs, Architecture Summary)
│   ├── sample_codebase/      # Sample codebase for scanning
│   ├── tests/                # Unit tests
│   ├── app.py                # Flask main entrypoint
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # Vite React TypeScript Frontend
│   ├── src/                  # React source files (App.tsx, components, etc.)
│   ├── assets/               # Frontend asset files
│   ├── index.html            # Main HTML entrypoint
│   ├── package.json          # Frontend dependencies & scripts
│   ├── tsconfig.json         # TypeScript configuration
│   └── vite.config.ts        # Vite configuration
│
├── .gitignore                # Workspace gitignore
├── package.json              # Root script runner for concurrent execution
└── README.md                 # Project Documentation
```

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18+ and `npm`
- **Python**: v3.10+
- **Ollama** *(Optional, required only if you want to use local offline AI models)*
- **Gemini API Key** *(Optional, required only if using cloud AI)*

## 🚀 Installation & Setup

### 1. Install Workspace Dependencies
Install the root developer dependencies (like `concurrently`) and the frontend packages:
```bash
npm install
npm run install:frontend
```

### 2. Install Backend Dependencies
Set up a Python virtual environment to isolate the backend dependencies:
```bash
# Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1

# Windows (Command Prompt)
.venv\Scripts\activate.bat

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate

# Install requirements
pip install -r backend/requirements.txt
```

### 3. Environment Variables
If you plan to use Gemini API, create a `.env` file in the root or backend directory and add your API key:
```env
GEMINI_API_KEY=your_api_key_here
```

## 💻 Usage

To run **both** the frontend and the backend simultaneously in development mode, run this command from the workspace root:

```bash
npm run dev
```

This starts:
- The **React Frontend** on [http://localhost:3000](http://localhost:3000)
- The **Flask Backend** on [http://localhost:5000](http://localhost:5000)

### How to analyze a codebase:
1. Open the UI at `http://localhost:3000`.
2. Go to the **Upload Insights** screen.
3. Paste the absolute local path to the folder you want to analyze. *(Note: Avoid selecting folders containing `node_modules` or `.venv` to speed up analysis).*
4. Select your preferred AI Model (Local or Gemini).
5. Click **Analyze with AI**.
6. Navigate through the sidebar to view the interactive File Explorer, Call Graphs, and Generated Architecture summaries!

### Running Services Separately
If you prefer running them in separate terminals for debugging:
- **Frontend**: `npm run start:frontend`
- **Backend**: `npm run start:backend` (Ensure your virtual environment is activated!)

