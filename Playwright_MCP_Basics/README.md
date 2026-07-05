# QA Copilot

A futuristic AI-powered QA assistant built with Streamlit that helps engineers search test cases, generate automation code, map JIRA tickets, and debug failures.

## Features

- **🤖 Chat Mode** - Ask questions about test cases, code, and JIRA tickets
- **🐛 Debug Mode** - Search and analyze test failures
- **💻 Generate Mode** - Create automation test code (Selenium/Playwright)
- **🎫 JIRA Mode** - Map and track JIRA tickets
- **📄 PDF Upload** - Upload and ingest PDF documents
- **📊 CSV Upload** - Upload and ingest test case CSV files
- **📈 Statistics** - View test case metrics, pass rate, JIRA links, and failures

## Tech Stack

- **Frontend**: Streamlit
- **Backend**: Python
- **LLM**: RAG chain with vector store
- **Data Storage**: ChromaDB for vector storage

## Project Structure

```
QA Copilot/
├── qa-copilot/
│   ├── Chapter_09_Project_QACopilot/
│   │   ├── src/
│   │   │   ├── ui/
│   │   │   │   └── app.py          # Main Streamlit UI
│   │   │   ├── llm/
│   │   │   │   ├── rag_chain.py    # RAG chain
│   │   │   │   └── service.py      # LLM service
│   │   │   ├── retriever/
│   │   │   │   └── vector_store.py # ChromaDB vector store
│   │   │   └── ingestion/
│   │   │       ├── csv_loader.py   # CSV data loader
│   │   │       ├── pdf_loader.py   # PDF data loader
│   │   │       ├── chunkers.py     # Text chunking
│   │   │       └── pipeline.py     # Data ingestion pipeline
│   │   ├── requirements.txt
│   │   └── start-app.ps1           # Startup script
│   └── data/
│       ├── csv/                     # Sample CSV test cases
│       ├── pdf/                     # Sample PDF documents
│       ├── playwright/              # Playwright test code
│       └── selenium/                # Selenium test code
└── qa_copilot_2027_ui.html         # UI mockup
```

## Installation

1. Navigate to the project directory:
```bash
cd "QA Copilot/qa-copilot/Chapter_09_Project_QACopilot"
```

2. Activate the virtual environment:
```powershell
.venv\Scripts\Activate.ps1
```

3. Run the application:
```powershell
streamlit run src\ui\app.py
```

4. Open your browser to `http://localhost:8501`

## Usage

### 1. Select Mode
Choose from Chat, Debug, Generate, or JIRA mode from the sidebar.

### 2. Choose Data Source
Select which data sources to search:
- All Sources
- Selenium
- Playwright
- Test Cases
- PDF Docs
- JIRA Summaries

### 3. Upload Data
- **PDF**: Upload PDF documents for ingestion under "Documents (PDF)"
- **CSV**: Upload test case CSV files under "Test Data (CSV)"
- Click "Ingest PDF" or "Ingest CSV" to process files
- Or click "Run Data Ingestion" to ingest all data from the `data/` folder

### 4. Ask Questions
Type your question in the chat input and press Enter.

## Sample Questions

- "Generate test cases for login functionality"
- "Find all test cases related to checkout"
- "Show me failed test cases from last run"
- "What is the test coverage for payment module?"

## UI Features

- Dark futuristic theme with cyan/purple accents
- Clean sidebar with mode selection, filters, and metrics
- Quick action buttons for common tasks
- File upload with drag-and-drop zones
- Real-time chat interface

## License

MIT