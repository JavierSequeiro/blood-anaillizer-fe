import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { BloodTest } from "../lib/mockData";

interface BiomarkerEvolutionProps {
  historicalTests: BloodTest[];
}

export function BiomarkerEvolution({ historicalTests }: BiomarkerEvolutionProps) {
  const [selectedBiomarker, setSelectedBiomarker] = useState<string>("Hematocrit");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const orderedTests = historicalTests.slice().reverse();
  const biomarkerDetailsMap = useMemo(() => {
    const map = new Map<string, { name: string, category: string }>();
    for (const test of orderedTests) {
      for (const biomarker of test.biomarkers) {
        if (!map.has(biomarker.id)) {
          map.set(biomarker.id, { 
            name: biomarker.name, 
            category: biomarker.category 
          });
        }
      }
    }
    return map;
  }, [historicalTests]);

  // Get all unique biomarker IDs and categories
  const allBiomarkerIds = Array.from(
    new Set(
      orderedTests.flatMap(test => 
        test.biomarkers.map(b => b.id)
      )
    )
  );

  const allCategories = Array.from(
    new Set(
      orderedTests.flatMap(test => 
        test.biomarkers.map(b => b.category)
      )
    )
  );

  // Get biomarker data for selected biomarker
  const selectedBiomarkerData = orderedTests[0]?.biomarkers.find(
    b => b.id === selectedBiomarker
  );

  // Prepare chart data
  const chartData = orderedTests.map(test => {
    const biomarker = test.biomarkers.find(b => b.id === selectedBiomarker);
    return {
      date: new Date(test.uploadDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }),
      value: biomarker?.value || null,
      min: biomarker?.referenceRange.min,
      max: biomarker?.referenceRange.max,
    };
  });

  // Filter biomarkers by category
  // const filteredBiomarkers = selectedCategory === "all"
  //   ? allBiomarkerIds
  //   : allBiomarkerIds.filter(id => {
  //       // FIX: Use the map to find the category
  //       const details = biomarkerDetailsMap.get(id);
  //       return details?.category === selectedCategory;
  //     });
  const filteredBiomarkers = selectedCategory === "all"
    ? allBiomarkerIds
    : allBiomarkerIds.filter(id => {
        const biomarker = orderedTests[0]?.biomarkers.find(b => b.id === id);
        return biomarker?.category === selectedCategory;
      });

  // Calculate trend
  const calculateTrend = (biomarkerId: string) => {
    const values = orderedTests
      .map(test => test.biomarkers.find(b => b.id === biomarkerId)?.value)
      .filter((v): v is number => v !== undefined);
    
    if (values.length < 2) return { direction: "stable", percentage: 0 };
    
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const change = ((lastValue - firstValue) / firstValue) * 100;
    
    if (Math.abs(change) < 2) return { direction: "stable", percentage: change };
    if (change > 0) return { direction: "up", percentage: change };
    return { direction: "down", percentage: change };
  };

  // Get status color for value
  const getStatusColor = (value: number, range: { min: number; max: number }) => {
    if (value < range.min || value > range.max) {
      return "text-red-600 bg-red-50";
    }
    const rangeSize = range.max - range.min;
    const lowerBuffer = range.min + rangeSize * 0.1;
    const upperBuffer = range.max - rangeSize * 0.1;
    if (value < lowerBuffer || value > upperBuffer) {
      return "text-orange-600 bg-orange-50";
    }
    return "text-green-600 bg-green-50";
  };

  let daySpanText = "N/A";

  if (orderedTests.length > 0) {
    const firstDate = new Date(orderedTests[0].uploadDate).getTime();
    const lastDate = new Date(orderedTests[orderedTests.length - 1].uploadDate).getTime();
    
    // This is your calculation
    const dayDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    const calculatedDays = Math.ceil(dayDiff);

    // Check if the result is 0 (which is the only case for < 1 with Math.ceil)
    if (calculatedDays < 1) {
      daySpanText = "the same day";
    } else {
      // Handle "1 day" vs "X days"
      daySpanText = `${calculatedDays} ${calculatedDays === 1 ? 'day' : 'days'}`;
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm mb-2 block text-gray-700">
              Filter by Category
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Biomarkers</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm mb-2 block text-gray-700">
              Select Biomarker to Chart
            </label>
            <Select value={selectedBiomarker} onValueChange={setSelectedBiomarker}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filteredBiomarkers.map(id => {
                  // const biomarker = historicalTests[0]?.biomarkers.find(b => b.id === id);
                  const details = biomarkerDetailsMap.get(id);
                  return (
                    <SelectItem key={id} value={id}>
                      {details?.name || id}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Chart */}
      {selectedBiomarkerData && (
        <Card className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3>{selectedBiomarkerData.name} Trend</h3>
                <p className="text-sm text-gray-600">
                  Reference range: {selectedBiomarkerData.referenceRange.min} - {selectedBiomarkerData.referenceRange.max} {selectedBiomarkerData.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {orderedTests.length} tests over {daySpanText}
                </span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: selectedBiomarkerData.unit, angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              
              {/* Reference range lines */}
              <ReferenceLine 
                y={selectedBiomarkerData.referenceRange.min} 
                stroke="#22c55e" 
                strokeDasharray="5 5"
                label={{ value: "Min", fontSize: 10 }}
              />
              <ReferenceLine 
                y={selectedBiomarkerData.referenceRange.max} 
                stroke="#22c55e" 
                strokeDasharray="5 5"
                label={{ value: "Max", fontSize: 10 }}
              />
              
              {/* Actual values line */}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                name={selectedBiomarkerData.name}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Comparison Table */}
      <Card className="overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h3>Biomarker Comparison Across Tests</h3>
          <p className="text-sm text-gray-600">
            Compare values over {orderedTests.length} tests
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Biomarker</TableHead>
                {orderedTests.map(test => (
                  <TableHead key={test.id} className="text-center min-w-[120px]">
                    {new Date(test.uploadDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}
                  </TableHead>
                ))}
                <TableHead className="text-center min-w-[100px]">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBiomarkers.map(biomarkerId => {
                const biomarker = orderedTests[0]?.biomarkers.find(b => b.id === biomarkerId);
                if (!biomarker) return null;
                
                const trend = calculateTrend(biomarkerId);
                
                return (
                  <TableRow key={biomarkerId}>
                    <TableCell>
                      <div>
                        <div>{biomarker.name}</div>
                        <div className="text-xs text-gray-500">
                          Range: {biomarker.referenceRange.min}-{biomarker.referenceRange.max} {biomarker.unit}
                        </div>
                      </div>
                    </TableCell>
                    {orderedTests.map(test => {
                      const testBiomarker = test.biomarkers.find(b => b.id === biomarkerId);
                      if (!testBiomarker) {
                        return (
                          <TableCell key={test.id} className="text-center text-gray-400">
                            -
                          </TableCell>
                        );
                      }
                      
                      const statusColor = getStatusColor(
                        testBiomarker.value,
                        testBiomarker.referenceRange
                      );
                      
                      return (
                        <TableCell key={test.id} className="text-center">
                          <div className={`inline-block px-2 py-1 rounded ${statusColor}`}>
                            <span className="font-mono">
                              {testBiomarker.value} {testBiomarker.unit}
                            </span>
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      {trend.direction === "up" && (
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-600">
                            +{trend.percentage.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      {trend.direction === "down" && (
                        <div className="flex items-center justify-center gap-1">
                          <TrendingDown className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            {trend.percentage.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      {trend.direction === "stable" && (
                        <div className="flex items-center justify-center gap-1">
                          <Minus className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Stable</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="mb-3 text-blue-900">Key Trends</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          {filteredBiomarkers.slice(0, 5).map(biomarkerId => {
            const biomarker = orderedTests[0]?.biomarkers.find(b => b.id === biomarkerId);
            const trend = calculateTrend(biomarkerId);
            
            if (Math.abs(trend.percentage) < 2 || !biomarker) return null;
            
            return (
              <li key={biomarkerId} className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  <strong>{biomarker.name}</strong> has {trend.direction === "up" ? "increased" : "decreased"} by{" "}
                  <strong>{Math.abs(trend.percentage).toFixed(1)}%</strong> since the first test
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
