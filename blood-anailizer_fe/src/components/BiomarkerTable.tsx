import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
  category: string;
}

interface BiomarkerTableProps {
  biomarkers: Biomarker[];
}

function getStatusColor(value: number, range: { min: number; max: number }) {
  if (value < range.min || value > range.max) {
    // Outside range - Red
    const deviation = Math.abs(
      value < range.min 
        ? ((range.min - value) / range.min) * 100 
        : ((value - range.max) / range.max) * 100
    );
    
    if (deviation > 20) {
      return { color: "destructive" as const, label: "Critical", bg: "bg-red-50" };
    }
    return { color: "destructive" as const, label: "Out of Range", bg: "bg-red-50" };
  }
  
  // Within range but close to edges - Orange
  const rangeSize = range.max - range.min;
  let lowerBuffer = range.min + rangeSize * 0.1;
  let upperBuffer = range.max - rangeSize * 0.1;

  const upperBound = 1000000000;

  if (range.max < upperBound){
  
    if (value < lowerBuffer || value > upperBuffer) {
      console.log("VALUE", value, "UPPER BUFFER", upperBuffer);
      return { color: "secondary" as const, label: "Borderline", bg: "bg-orange-50" };
    }
  }
  
  // Normal range - Green
  return { color: "default" as const, label: "Normal", bg: "bg-green-50" };
}

export function BiomarkerTable({ biomarkers }: BiomarkerTableProps) {
  // Group biomarkers by category
  const groupedBiomarkers = biomarkers.reduce((acc, biomarker) => {
    if (!acc[biomarker.category]) {
      acc[biomarker.category] = [];
    }
    acc[biomarker.category].push(biomarker);
    return acc;
  }, {} as Record<string, Biomarker[]>);

  const formatRangeValue = (num: number | null | undefined): string => {
    // Handle cases where the number might not exist
    if (typeof num !== 'number') {
      return 'N/A';
    }

    // Check if over 1000
    if (num > 1000) {
      // toExponential(1) gives one decimal place, e.g., "1.0e+4"
      return num.toExponential(1);
    }

    // Return the number as a normal string (e.g., "800")
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedBiomarkers).map(([category, markers]) => (
        <Card key={category} className="overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <h3>{category}</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biomarker</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Reference Range</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {markers.map((biomarker) => {
                const status = getStatusColor(biomarker.value, biomarker.referenceRange);
                return (
                  <TableRow key={biomarker.id} className={status.bg}>
                    <TableCell>{biomarker.name}</TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {biomarker.value} {biomarker.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {biomarker.referenceRange.min} - {formatRangeValue(biomarker.referenceRange.max)} {biomarker.unit}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.color}>
                        {status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ))}
    </div>
  );
}
