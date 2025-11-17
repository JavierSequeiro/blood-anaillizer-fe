import { Upload, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BloodTestUploadProps {
  onFileSelect: (file: File | null) => void;
  hasData: boolean;
}

export function BloodTestUpload({ onFileSelect, hasData }: BloodTestUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  const loadSampleData = () => {
    // Simulate loading sample data
    onFileSelect(new File([], "sample_blood_test.pdf"));
  };

  return (
    <Card className="p-8 border-dashed border-2">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-full">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h3 className="mb-2">Upload Blood Test Results</h3>
          <p className="text-gray-600 mb-4">
            Upload a PDF or image of blood test results to analyze
          </p>
        </div>
        <div className="flex gap-3">
          <label htmlFor="file-upload">
            <Button asChild>
              <span>
                <FileText className="w-4 h-4 mr-2" />
                Choose File
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="outline" onClick={loadSampleData}>
            Load Sample Data
          </Button>
        </div>
        {hasData && (
          <p className="text-green-600 text-sm">
            ✓ Blood test data loaded successfully
          </p>
        )}
      </div>
    </Card>
  );
}
