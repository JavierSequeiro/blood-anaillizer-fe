import { useState, useEffect } from "react";
import { Activity, FileText, BarChart3, TrendingUp, History, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { BloodTestUpload } from "./components/BloodTestUpload";
import { BiomarkerTable } from "./components/BiomarkerTable";
import { LLMReport } from "./components/LLMReport";
import { BloodTestDashboard } from "./components/BloodTestDashboard";
import { BiomarkerEvolution } from "./components/BiomarkerEvolution";
import { PastTests } from "./components/PastTests";
import { AuthForm } from "./components/AuthForm";
import { SettingsDialog } from "./components/SettingsDialog";
import { SAMPLE_BIOMARKERS, SAMPLE_LLM_REPORT, HISTORICAL_TESTS } from "./lib/mockData";
import { Toaster } from "./components/ui/sonner";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Button } from "./components/ui/button";
import { bloodTestApi, userApi } from "./utils/api";
import { analyzeBloodTestFile } from "./utils/pythonApi";
import { toast } from "sonner@2.0.3";
import logo from "./backend-template/utils/Company_Logo.png";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [hasData, setHasData] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [allTests, setAllTests] = useState<any[]>([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>(null);

  const handleAuthSuccess = async (token: string, uid: string) => {
    setAccessToken(token);
    setUserId(uid);
    setIsAuthenticated(true);
    
    // Load user preferences and blood tests
    await loadUserPreferences(token);
    await loadBloodTests(token);
  };

  const loadUserPreferences = async (token: string) => {
    try {
      const response = await userApi.getPreferences(token);
      setUserPreferences(response.preferences);
      console.log("User preferences loaded:", response.preferences);
    } catch (error) {
      console.error("Error loading user preferences:", error);
      // Set default preferences if loading fails
      setUserPreferences({
        userType: "Patient",
        language: "en"
      });
    }
  };

  const loadBloodTests = async (token: string) => {
    setIsLoadingTests(true);
    try {
      const response = await bloodTestApi.getAll(token);
      setAllTests(response.tests);
      
      if (response.tests.length > 0) {
        setCurrentTest(response.tests[0]);
        setHasData(true);
      }
    } catch (error) {
      console.error("Error loading blood tests:", error);
      toast.error("Failed to load blood tests");
    } finally {
      setIsLoadingTests(false);
    }
  };

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      setIsGenerating(true);
      
      try {
        // Call Python backend to analyze the blood test file
        // Pass user preferences to the Python API
        const analysisResult = await analyzeBloodTestFile(file, {
          language: userPreferences?.language || "en",
          userType: userPreferences?.userType || "Patient"
        });
        
        // Create test data from Python backend response
        const testData = {
          biomarkers: analysisResult.biomarkers,
          report: analysisResult.report,
          fileName: analysisResult.fileName,
        };

        // Save to Supabase database
        const response = await bloodTestApi.create(testData, accessToken);
        
        setCurrentTest(response.test);
        setHasData(true);
        
        // Reload all tests
        await loadBloodTests(accessToken);
        
        toast.success("Blood test analyzed and uploaded successfully!");
      } catch (error) {
        console.error("Error uploading blood test:", error);
        toast.error(`Failed to analyze blood test: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccessToken("");
    setUserId("");
    setHasData(false);
    setCurrentTest(null);
    setAllTests([]);
  };

  console.log("allTests:", allTests);
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <ImageWithFallback 
                src={logo} 
                alt="Blood AnAllizer Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1>Blood Test Analysis Platform</h1>
                <p className="text-sm text-gray-600">
                  AI-powered biomarker visualization and reporting
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SettingsDialog />
              {isAuthenticated && (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        ) : !hasData ? (
          <div className="max-w-2xl mx-auto mt-12">
            <BloodTestUpload onFileSelect={handleFileSelect} hasData={hasData} />
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="mb-3 text-blue-900">Platform Features:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Color-coded biomarker visualization (green, orange, red) based on reference ranges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>AI-generated comprehensive health reports using LLM analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Dashboard overview with key health metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Categorized biomarker display by test type</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Track biomarker evolution across multiple tests over time</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>Test Results Analysis</h2>
                <p className="text-gray-600">
                  {currentTest?.biomarkers?.length || 0} biomarkers analyzed • {new Date(currentTest?.uploadDate).toLocaleDateString() || 'Today'}
                </p>
              </div>
              <BloodTestUpload onFileSelect={handleFileSelect} hasData={hasData} />
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 max-w-3xl">
                <TabsTrigger value="overview">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="biomarkers">
                  <Activity className="w-4 h-4 mr-2" />
                  Biomarkers
                </TabsTrigger>
                <TabsTrigger value="evolution">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Evolution
                </TabsTrigger>
                <TabsTrigger value="past-tests">
                  <History className="w-4 h-4 mr-2" />
                  Past Tests
                </TabsTrigger>
                <TabsTrigger value="report">
                  <FileText className="w-4 h-4 mr-2" />
                  AI Report
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <BloodTestDashboard biomarkers={currentTest?.biomarkers || []} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="mb-4">Quick Summary</h3>
                      <BiomarkerTable 
                        biomarkers={(currentTest?.biomarkers || []).filter((m: any) => {
                          const { min, max } = m.referenceRange;
                          return m.value < min || m.value > max;
                        })} 
                      />
                      {(currentTest?.biomarkers || []).filter((m: any) => {
                        const { min, max } = m.referenceRange;
                        return m.value < min || m.value > max;
                      }).length === 0 && (
                        <p className="text-gray-600 text-center py-8">
                          All biomarkers are within normal ranges
                        </p>
                      )}
                    </div>
                    <LLMReport 
                      report={currentTest?.report || ""} 
                      isGenerating={isGenerating}
                      onRegenerate={handleRegenerate}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="biomarkers" className="mt-6">
                <BiomarkerTable biomarkers={currentTest?.biomarkers || []} />
              </TabsContent>

              <TabsContent value="evolution" className="mt-6">
                <BiomarkerEvolution historicalTests={allTests} />
              </TabsContent>

              <TabsContent value="past-tests" className="mt-6">
                <PastTests historicalTests={allTests} />
              </TabsContent>

              <TabsContent value="report" className="mt-6">
                <LLMReport 
                  report={currentTest?.report || ""} 
                  isGenerating={isGenerating}
                  onRegenerate={handleRegenerate}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            Blood Test Analysis Platform • API Prototype • For demonstration purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}