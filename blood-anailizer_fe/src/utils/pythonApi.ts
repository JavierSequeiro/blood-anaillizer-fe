/**
 * Python Backend API Integration
 * 
 * This module handles communication with the Python FastAPI backend
 * for blood test analysis and LLM report generation
 */

// Get Python API URL from multiple sources (priority order):
// 1. localStorage (user-configured via Settings)
// 2. Environment variable
// 3. Default localhost

function getPythonApiUrl(): string {
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('pythonApiUrl');
    if (savedUrl) return savedUrl;
  }
  
  // Safely access import.meta.env
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PYTHON_API_URL) {
      return import.meta.env.VITE_PYTHON_API_URL;
    }
  } catch (e) {
    // import.meta might not be available in all contexts
  }
  
  // return 'http://localhost:8000';
  return "https://blood-anaillizer.onrender.com";
}

const PYTHON_API_URL = getPythonApiUrl();

export interface PythonAnalysisResponse {
  biomarkers: Array<{
    id: string;
    name: string;
    value: number;
    unit: string;
    referenceRange: {
      min: number;
      max: number;
    };
    category: string;
  }>;
  report: string;
  fileName: string;
}

export interface AnalysisOptions {
  language?: string;  // Changed to accept any string (en, es, ch, fr, etc.)
  userType?: 'Patient' | 'Doctor';
}

/**
 * Upload and analyze a blood test file using the Python backend
 */
export async function analyzeBloodTestFile(
  file: File,
  options: AnalysisOptions = {}
): Promise<PythonAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // Build query parameters
  const params = new URLSearchParams();
  if (options.language) {
    params.append('language', options.language);
  }
  if (options.userType) {
    params.append('user_type', options.userType);
  }

  const url = `${PYTHON_API_URL}/api/analyze-blood-test${params.toString() ? '?' + params.toString() : ''}`;

  try {
    console.log(`Calling Python API at: ${url}`);
    console.log('Analysis options:', options);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Add mode to handle CORS
      mode: 'cors',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to analyze blood test';
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Python API response:', data);
    return data;
  } catch (error) {
    console.error('Error analyzing blood test:', error);
    
    // Provide more helpful error messages
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to Python backend at ${PYTHON_API_URL}. ` +
        'Please ensure your Python FastAPI server is running and accessible. ' +
        'Check the console for the exact URL being called.'
      );
    }
    
    throw error;
  }
}

/**
 * Regenerate the LLM report for existing biomarkers
 */
export async function regenerateReport(
  biomarkers: any[],
  options: AnalysisOptions = {}
): Promise<string> {
  const url = `${PYTHON_API_URL}/api/regenerate-report`;
  
  try {
    console.log(`Calling Python API at: ${url}`);
    console.log('Regenerate options:', options);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        biomarkers,
        language: options.language || 'en',
        user_type: options.userType || 'Patient',
      }),
      mode: 'cors',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to regenerate report';
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Python API response:', data);
    return data.report;
  } catch (error) {
    console.error('Error regenerating report:', error);
    
    // Provide more helpful error messages
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to Python backend at ${PYTHON_API_URL}. ` +
        'Please ensure your Python FastAPI server is running and accessible.'
      );
    }
    
    throw error;
  }
}

export interface GeneratePDFOptions {
  report: string;
}

export async function generatePDFReport(
  options: GeneratePDFOptions
): Promise<Blob> {
  const url = `${PYTHON_API_URL}/api/generate-pdf`;
  
  try {
    console.log(`Calling Python API at: ${url}`);
    console.log('PDF generation options:', options);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        report: options.report,}),
      mode: 'cors',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate PDF';
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // The response should be a PDF blob
    const blob = await response.blob();

    if (blob.type !== 'application/pdf') {
        throw new Error(`Received unexpected content type: ${blob.type}`);
    }
    // const response_json = await response.json()
    // const blobReceived = response_json.pdf_blob;
    // const blobPDF  = b64toBlob(blobReceived, 'application/pdf'); 
    // console.log(blob.type)
    console.log('PDF generated successfully, size:', blob.size);
    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Provide more helpful error messages
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to Python backend at ${PYTHON_API_URL}. ` +
        'Please ensure your Python FastAPI server is running and accessible.'
      );
    }
    
    throw error;
  }
}