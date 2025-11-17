import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { Biomarker } from "./BiomarkerTable";

interface BloodTestDashboardProps {
  biomarkers: Biomarker[];
}

export function BloodTestDashboard({ biomarkers }: BloodTestDashboardProps) {
  const stats = biomarkers.reduce(
    (acc, marker) => {
      const { min, max } = marker.referenceRange;
      if (marker.value < min || marker.value > max) {
        acc.outOfRange++;
        const deviation = Math.abs(
          marker.value < min 
            ? ((min - marker.value) / min) * 100 
            : ((marker.value - max) / max) * 100
        );
        if (deviation > 20) acc.critical++;
      } else {
        const rangeSize = max - min;
        const lowerBuffer = min + rangeSize * 0.1;
        const upperBuffer = max - rangeSize * 0.1;
        if (marker.value < lowerBuffer || marker.value > upperBuffer) {
          acc.borderline++;
        } else {
          acc.normal++;
        }
      }
      return acc;
    },
    { normal: 0, borderline: 0, outOfRange: 0, critical: 0 }
  );

  const total = biomarkers.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-800">Normal</span>
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div className="text-green-900">
          {stats.normal}
        </div>
        <p className="text-sm text-green-700">
          {((stats.normal / total) * 100).toFixed(0)}% of biomarkers
        </p>
      </Card>

      <Card className="p-6 bg-orange-50 border-orange-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-orange-800">Borderline</span>
          <TrendingDown className="w-5 h-5 text-orange-600" />
        </div>
        <div className="text-orange-900">
          {stats.borderline}
        </div>
        <p className="text-sm text-orange-700">
          {((stats.borderline / total) * 100).toFixed(0)}% of biomarkers
        </p>
      </Card>

      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-red-800">Out of Range</span>
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div className="text-red-900">
          {stats.outOfRange}
        </div>
        <p className="text-sm text-red-700">
          {((stats.outOfRange / total) * 100).toFixed(0)}% of biomarkers
        </p>
      </Card>

      <Card className="p-6 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-800">Critical</span>
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <div className="text-purple-900">
          {stats.critical}
        </div>
        <p className="text-sm text-purple-700">
          Require attention
        </p>
      </Card>
    </div>
  );
}
