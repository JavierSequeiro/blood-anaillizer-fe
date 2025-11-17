import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  FileText,
  Download,
  Copy,
  RefreshCw,
  Eye,
  FileDown,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import jsPDF from "jspdf";
import { generatePDFReport } from "../utils/pythonApi";

interface LLMReportProps {
  report: string;
  isGenerating?: boolean;
  onRegenerate?: () => void;
}

export function LLMReport({
  report,
  isGenerating = false,
  onRegenerate,
}: LLMReportProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"text" | "pdf">("text");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    toast.success("Report copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // const generatePDF = (): jsPDF => {
  //   const pdf = new jsPDF();
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const pageHeight = pdf.internal.pageSize.getHeight();
  //   const margin = 20;

  //   // Draw logo using PDF drawing commands (medical cross)
  //   const logoY = 15;
  //   const centerX = pageWidth / 2;
    
  //   // Draw circle
  //   pdf.setDrawColor(59, 130, 246); // Blue color
  //   pdf.setLineWidth(1.5);
  //   pdf.circle(centerX, logoY + 8, 8, 'S');
    
  //   // Draw medical cross
  //   pdf.setFillColor(59, 130, 246); // Blue color
  //   // Vertical bar of cross
  //   pdf.rect(centerX - 1.5, logoY + 3, 3, 10, 'F');
  //   // Horizontal bar of cross
  //   pdf.rect(centerX - 4, logoY + 6.5, 8, 3, 'F');
    
  //   // Add "Blood Test Analysis" text below logo
  //   pdf.setFontSize(10);
  //   pdf.setFont("helvetica", "bold");
  //   pdf.setTextColor(59, 130, 246);
  //   const logoText = "Blood Test Analysis";
  //   const logoTextWidth = pdf.getTextWidth(logoText);
  //   pdf.text(logoText, (pageWidth - logoTextWidth) / 2, logoY + 22);

  //   // Add title
  //   pdf.setFontSize(18);
  //   pdf.setFont("helvetica", "bold");
  //   pdf.setTextColor(0, 0, 0);
  //   const title = "Medical Report";
  //   const titleWidth = pdf.getTextWidth(title);
  //   pdf.text(
  //     title,
  //     (pageWidth - titleWidth) / 2,
  //     logoY + 32,
  //   );

  //   // Add date
  //   pdf.setFontSize(10);
  //   pdf.setFont("helvetica", "normal");
  //   pdf.setTextColor(100, 100, 100);
  //   const date = `Generated on: ${new Date().toLocaleDateString(
  //     "en-US",
  //     {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     },
  //   )}`;
  //   const dateWidth = pdf.getTextWidth(date);
  //   pdf.text(
  //     date,
  //     (pageWidth - dateWidth) / 2,
  //     logoY + 40,
  //   );

  //   // Add separator line
  //   pdf.setDrawColor(200, 200, 200);
  //   pdf.line(
  //     margin,
  //     logoY + 46,
  //     pageWidth - margin,
  //     logoY + 46,
  //   );

  //   // Add report content
  //   pdf.setFontSize(10);
  //   pdf.setFont("helvetica", "normal");
  //   pdf.setTextColor(0, 0, 0);

  //   let yPosition = logoY + 56;
  //   const lineHeight = 6;
  //   const maxWidth = pageWidth - margin * 2;

  //   // Split report into lines and add to PDF
  //   const lines = report.split("\n");

  //   for (const line of lines) {
  //     // Check if we need a new page
  //     if (yPosition > pageHeight - margin) {
  //       pdf.addPage();
  //       yPosition = margin;
  //     }

  //     if (line.trim() === "") {
  //       yPosition += lineHeight / 2;
  //       continue;
  //     }

  //     // Check for bold text (headings with all caps or ending with colon)
  //     if (
  //       line.trim().match(/^[A-Z\s]+:?$/) ||
  //       line.trim().endsWith(":")
  //     ) {
  //       pdf.setFont("helvetica", "bold");
  //     } else {
  //       pdf.setFont("helvetica", "normal");
  //     }

  //     // Split long lines
  //     const wrappedLines = pdf.splitTextToSize(
  //       line,
  //       maxWidth,
  //     );

  //     for (const wrappedLine of wrappedLines) {
  //       if (yPosition > pageHeight - margin) {
  //         pdf.addPage();
  //         yPosition = margin;
  //       }
  //       pdf.text(wrappedLine, margin, yPosition);
  //       yPosition += lineHeight;
  //     }
  //   }

  //   // Add footer to each page
  //   const totalPages = pdf.internal.pages.length - 1;
  //   for (let i = 1; i <= totalPages; i++) {
  //     pdf.setPage(i);
  //     pdf.setFontSize(8);
  //     pdf.setFont("helvetica", "italic");
  //     pdf.setTextColor(128, 128, 128);
  //     pdf.text(
  //       `Page ${i} of ${totalPages}`,
  //       pageWidth / 2,
  //       pageHeight - 10,
  //       { align: "center" },
  //     );
  //   }

  //   return pdf;
  // };

  const handleViewPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      // Clean up previous PDF URL if exists
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      // const pdf = generatePDF();
      // const blob = pdf.output("blob");
      const blob = await generatePDFReport({
        report
      });

      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setViewMode("pdf");
      toast.success("PDF preview generated");
    } catch (error) {
      console.error("Error generating PDF preview:", error);
      toast.error("Failed to generate PDF preview");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownload = async () => {
    try {
      // const pdf = generatePDF();
      // Download the PDF
      setIsGeneratingPDF(true);
      // pdf.save(
      //   `blood-test-report-${new Date().toISOString().split("T")[0]}.pdf`,
      // );
      // Generate PDF using Python backend
      // NEW FROM HERE
      const pdfBlob = await generatePDFReport({
        report,
        });

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `blood-test-report-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      // NEW UP TO HERE
      toast.success("Report downloaded as PDF");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3>AI-Generated Analysis Report</h3>
            <p className="text-sm text-gray-600">
              Generated by LLM based on your biomarkers
            </p>
          </div>
        </div>
        <Badge variant="secondary">AI Generated</Badge>
      </div>

      <div className="p-6">
        {isGenerating ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
              <p className="text-gray-600">
                Analyzing your blood test results...
              </p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === "text" ? (
              <div className="prose prose-sm max-w-none mb-6 whitespace-pre-line">
                {report}
              </div>
            ) : (
              <iframe
                src={pdfUrl as string}
                width="100%"
                height="500px"
                frameBorder="0"
              />
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy Report"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              {onRegenerate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRegenerate}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewPDF}
              >
                <Eye className="w-4 h-4 mr-2" />
                View PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("text")}
                disabled={viewMode === "text"}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Back to Text
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t">
        <p className="text-xs text-gray-600">
          ⚠️ This report is AI-generated and for informational
          purposes only. Always consult with a healthcare
          professional for medical advice.
        </p>
      </div>
    </Card>
  );
}