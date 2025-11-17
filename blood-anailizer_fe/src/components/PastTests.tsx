import { useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { BiomarkerTable } from "./BiomarkerTable";
import { BloodTestDashboard } from "./BloodTestDashboard";
import { BloodTest } from "../lib/mockData";
import { Badge } from "./ui/badge";

interface PastTestsProps {
  historicalTests: BloodTest[];
}

export function PastTests({ historicalTests }: PastTestsProps) {
  const [selectedTest, setSelectedTest] = useState<BloodTest | null>(
    historicalTests.length > 0 ? historicalTests[historicalTests.length - 1] : null
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  const getTestStatus = (test: BloodTest) => {
    const outOfRangeCount = test.biomarkers.filter((marker) => {
      const { min, max } = marker.referenceRange;
      return marker.value < min || marker.value > max;
    }).length;

    if (outOfRangeCount === 0) return { label: "All Normal", color: "default" as const };
    if (outOfRangeCount <= 2) return { label: `${outOfRangeCount} Alert`, color: "secondary" as const };
    return { label: `${outOfRangeCount} Alerts`, color: "destructive" as const };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Past Tests List */}
      <div className="lg:col-span-1">
        <Card className="p-4">
          <h3 className="mb-4">Test History</h3>
          <div className="space-y-2">
            {historicalTests
              .slice()
              .reverse()
              .map((test) => {
                const status = getTestStatus(test);
                const isSelected = selectedTest?.id === test.id;

                return (
                  <button
                    key={test.id}
                    onClick={() => setSelectedTest(test)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-blue-50 border-blue-300 shadow-sm"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {formatDate(test.uploadDate)}
                        </span>
                      </div>
                      {isSelected && (
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {test.biomarkers.length} biomarkers
                      </span>
                      <Badge variant={status.color} className="text-xs">
                        {status.label}
                      </Badge>
                    </div>
                  </button>
                );
              })}
          </div>
        </Card>
      </div>

      {/* Selected Test Details */}
      <div className="lg:col-span-3">
        {selectedTest ? (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2>Test Results - {formatDate(selectedTest.uploadDate)}</h2>
                <Badge variant="outline">
                  {selectedTest.biomarkers.length} biomarkers analyzed
                </Badge>
              </div>
              <p className="text-gray-600">
                Complete blood test analysis from this date
              </p>
            </div>

            <BloodTestDashboard biomarkers={selectedTest.biomarkers} />

            <div>
              <h3 className="mb-4">Detailed Biomarkers</h3>
              <BiomarkerTable biomarkers={selectedTest.biomarkers} />
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">No Tests Available</h3>
            <p className="text-gray-500 text-sm">
              Upload blood test data to view historical results
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
