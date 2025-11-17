# Python Backend Setup Instructions

## Overview

This application requires a Python FastAPI backend to process blood test PDFs and generate LLM reports. The frontend calls the Python API when users upload blood test files.

## Required Python Backend

Your Python FastAPI server should have the following endpoints:

### 1. POST `/api/analyze-blood-test`

Analyzes a blood test PDF file and returns biomarker data + LLM report.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: File upload (`file` field)
- Query Parameters:
  - `language` (optional): Language code (en, es, ch, fr)
  - `user_type` (optional): User type (Patient, Doctor)

**Response:**
```json
{
  "biomarkers": [
    {
      "name": "Hemoglobin",
      "value": 14.5,
      "unit": "g/dL",
      "referenceRange": {
        "min": 13.5,
        "max": 17.5
      }
    }
  ],
  "report": "AI-generated medical report text...",
  "fileName": "blood_test.pdf"
}
```

### 2. POST `/api/regenerate-report` (optional)

Regenerates the LLM report for existing biomarkers.

**Request:**
```json
{
  "biomarkers": [...],
  "language": "en",
  "user_type": "Patient"
}
```

**Response:**
```json
{
  "report": "Regenerated AI report text..."
}
```

## Configuration

### Local Development

By default, the frontend expects the Python backend at:
```
http://localhost:8000
```

### Custom Backend URL

Set the `VITE_PYTHON_API_URL` environment variable:

**Option 1: Create `.env` file in project root:**
```env
VITE_PYTHON_API_URL=http://localhost:8000
# or
VITE_PYTHON_API_URL=https://your-python-backend.com
```

**Option 2: Set environment variable before running:**
```bash
VITE_PYTHON_API_URL=http://localhost:8000 npm run dev
```

## CORS Configuration

Your Python FastAPI server MUST allow CORS from the frontend origin:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing the Connection

1. Start your Python FastAPI server
2. Open the browser console when uploading a file
3. Look for logs showing:
   - `Calling Python API at: http://localhost:8000/api/analyze-blood-test?language=en&user_type=Patient`
   - Any error messages if the connection fails

## Troubleshooting

### Error: "Failed to fetch"
- **Cause**: Python backend is not running or not accessible
- **Solution**: 
  1. Start your Python FastAPI server: `uvicorn main:app --reload`
  2. Check the URL in browser console logs
  3. Verify CORS is configured correctly
  4. Test the endpoint directly with curl or Postman

### Error: "CORS policy"
- **Cause**: CORS not configured on Python backend
- **Solution**: Add the CORS middleware shown above

### Error: "Cannot connect to Python backend"
- **Cause**: Wrong backend URL
- **Solution**: Check `VITE_PYTHON_API_URL` environment variable

## Your Existing Python Classes

The backend should use your existing classes:
- `PDFReaderNam` - Extract data from PDF
- `DFAnalyzer` - Analyze biomarkers
- `MedPrompter` - Generate prompts
- `LLMReportGenerator` - Generate reports

Example FastAPI integration:
```python
from fastapi import FastAPI, File, UploadFile
from your_module import PDFReaderNam, DFAnalyzer, MedPrompter, LLMReportGenerator

@app.post("/api/analyze-blood-test")
async def analyze_blood_test(
    file: UploadFile = File(...),
    language: str = "en",
    user_type: str = "Patient"
):
    # Your implementation using your classes
    pdf_reader = PDFReaderNam()
    analyzer = DFAnalyzer()
    prompter = MedPrompter()
    report_gen = LLMReportGenerator()
    
    # Process the file...
    return {
        "biomarkers": [...],
        "report": "...",
        "fileName": file.filename
    }
```
