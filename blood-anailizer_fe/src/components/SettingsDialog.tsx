import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Settings, ExternalLink } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Alert, AlertDescription } from "./ui/alert";

export function SettingsDialog() {
  const [pythonApiUrl, setPythonApiUrl] = useState(
    localStorage.getItem("pythonApiUrl") || "http://localhost:8000"
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    try {
      // Validate URL
      new URL(pythonApiUrl);
      
      localStorage.setItem("pythonApiUrl", pythonApiUrl);
      toast.success("Settings saved successfully");
      setIsOpen(false);
      
      // Suggest page reload
      toast.info("Please refresh the page for changes to take effect", {
        duration: 5000,
      });
    } catch (error) {
      toast.error("Invalid URL format");
    }
  };

  const handleTest = async () => {
    try {
      const url = new URL(pythonApiUrl);
      const testUrl = `${url.origin}/docs`;
      
      const response = await fetch(pythonApiUrl, {
        method: "GET",
        mode: "no-cors", // Allow testing without CORS
      });
      
      toast.success("Connection test initiated. Check your Python backend logs.");
      window.open(testUrl, "_blank");
    } catch (error) {
      toast.error("Failed to test connection: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Settings</DialogTitle>
          <DialogDescription>
            Configure the connection to your Python FastAPI backend
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Alert>
            <AlertDescription>
              <strong>Important:</strong> Your Python backend must be running and accessible for blood test analysis to work.
              See <code>PYTHON_BACKEND_SETUP.md</code> for setup instructions.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="python-api-url">Python Backend URL</Label>
            <Input
              id="python-api-url"
              type="url"
              value={pythonApiUrl}
              onChange={(e) => setPythonApiUrl(e.target.value)}
              placeholder="http://localhost:8000"
            />
            <p className="text-sm text-gray-600">
              The URL where your Python FastAPI server is running
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm">
              <strong>Common URLs:</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPythonApiUrl("http://localhost:8000")}
              >
                Local (8000)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPythonApiUrl("http://localhost:8080")}
              >
                Local (8080)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPythonApiUrl("http://127.0.0.1:8000")}
              >
                127.0.0.1:8000
              </Button>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <p className="text-sm">
              <strong>Required Endpoints:</strong>
            </p>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• POST <code>/api/analyze-blood-test</code> - Analyze blood test files</li>
              <li>• POST <code>/api/regenerate-report</code> - Regenerate LLM reports (optional)</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">
              <strong>Current Configuration:</strong>
            </p>
            <div className="bg-gray-50 p-3 rounded border font-mono text-sm break-all">
              {pythonApiUrl}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
            <Button variant="outline" onClick={handleTest}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Test & View Docs
            </Button>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              💡 <strong>Tip:</strong> After changing the URL, refresh the page for changes to take effect.
              You can also set <code>VITE_PYTHON_API_URL</code> as an environment variable.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}
