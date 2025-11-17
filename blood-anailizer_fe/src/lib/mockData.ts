import { Biomarker } from "../components/BiomarkerTable";

export interface BloodTest {
  id: string;
  date: string;
  biomarkers: Biomarker[];
}

export const SAMPLE_BIOMARKERS: Biomarker[] = [
  // Complete Blood Count
  {
    id: "wbc",
    name: "White Blood Cells (WBC)",
    value: 7.2,
    unit: "K/uL",
    referenceRange: { min: 4.5, max: 11.0 },
    category: "Complete Blood Count"
  },
  {
    id: "rbc",
    name: "Red Blood Cells (RBC)",
    value: 4.8,
    unit: "M/uL",
    referenceRange: { min: 4.5, max: 5.9 },
    category: "Complete Blood Count"
  },
  {
    id: "hemoglobin",
    name: "Hemoglobin",
    value: 13.2,
    unit: "g/dL",
    referenceRange: { min: 13.5, max: 17.5 },
    category: "Complete Blood Count"
  },
  {
    id: "hematocrit",
    name: "Hematocrit",
    value: 41.5,
    unit: "%",
    referenceRange: { min: 38.8, max: 50.0 },
    category: "Complete Blood Count"
  },
  {
    id: "platelets",
    name: "Platelets",
    value: 245,
    unit: "K/uL",
    referenceRange: { min: 150, max: 400 },
    category: "Complete Blood Count"
  },
  
  // Metabolic Panel
  {
    id: "glucose",
    name: "Glucose",
    value: 105,
    unit: "mg/dL",
    referenceRange: { min: 70, max: 100 },
    category: "Metabolic Panel"
  },
  {
    id: "bun",
    name: "Blood Urea Nitrogen (BUN)",
    value: 18,
    unit: "mg/dL",
    referenceRange: { min: 7, max: 20 },
    category: "Metabolic Panel"
  },
  {
    id: "creatinine",
    name: "Creatinine",
    value: 1.0,
    unit: "mg/dL",
    referenceRange: { min: 0.7, max: 1.3 },
    category: "Metabolic Panel"
  },
  {
    id: "sodium",
    name: "Sodium",
    value: 140,
    unit: "mmol/L",
    referenceRange: { min: 136, max: 145 },
    category: "Metabolic Panel"
  },
  {
    id: "potassium",
    name: "Potassium",
    value: 4.2,
    unit: "mmol/L",
    referenceRange: { min: 3.5, max: 5.2 },
    category: "Metabolic Panel"
  },
  
  // Lipid Panel
  {
    id: "total_cholesterol",
    name: "Total Cholesterol",
    value: 210,
    unit: "mg/dL",
    referenceRange: { min: 0, max: 200 },
    category: "Lipid Panel"
  },
  {
    id: "ldl",
    name: "LDL Cholesterol",
    value: 135,
    unit: "mg/dL",
    referenceRange: { min: 0, max: 100 },
    category: "Lipid Panel"
  },
  {
    id: "hdl",
    name: "HDL Cholesterol",
    value: 52,
    unit: "mg/dL",
    referenceRange: { min: 40, max: 200 },
    category: "Lipid Panel"
  },
  {
    id: "triglycerides",
    name: "Triglycerides",
    value: 165,
    unit: "mg/dL",
    referenceRange: { min: 0, max: 150 },
    category: "Lipid Panel"
  },
  
  // Liver Function
  {
    id: "alt",
    name: "ALT (SGPT)",
    value: 28,
    unit: "U/L",
    referenceRange: { min: 7, max: 56 },
    category: "Liver Function"
  },
  {
    id: "ast",
    name: "AST (SGOT)",
    value: 22,
    unit: "U/L",
    referenceRange: { min: 10, max: 40 },
    category: "Liver Function"
  },
  {
    id: "bilirubin",
    name: "Total Bilirubin",
    value: 0.8,
    unit: "mg/dL",
    referenceRange: { min: 0.1, max: 1.2 },
    category: "Liver Function"
  },
  
  // Thyroid
  {
    id: "tsh",
    name: "TSH",
    value: 2.1,
    unit: "mIU/L",
    referenceRange: { min: 0.4, max: 4.0 },
    category: "Thyroid Function"
  },
  
  // Vitamins
  {
    id: "vitamin_d",
    name: "Vitamin D",
    value: 28,
    unit: "ng/mL",
    referenceRange: { min: 30, max: 100 },
    category: "Vitamins & Minerals"
  },
  {
    id: "vitamin_b12",
    name: "Vitamin B12",
    value: 450,
    unit: "pg/mL",
    referenceRange: { min: 200, max: 900 },
    category: "Vitamins & Minerals"
  }
];

export const SAMPLE_LLM_REPORT = `BLOOD TEST ANALYSIS REPORT
Generated on: October 11, 2025

SUMMARY:
Your blood test results show mostly healthy markers with a few areas that warrant attention and lifestyle modifications. Overall, your results indicate good general health with some minor concerns that can be addressed through diet and lifestyle changes.

KEY FINDINGS:

✓ NORMAL RANGES (15 markers):
Your Complete Blood Count shows healthy immune function and oxygen-carrying capacity. Liver enzymes (ALT, AST), kidney function markers (BUN, Creatinine), and electrolytes (Sodium, Potassium) are all within optimal ranges, indicating good organ function.

⚠️ AREAS OF CONCERN:

1. Lipid Panel (Moderate Priority):
   • Total Cholesterol: 210 mg/dL (slightly elevated, target: <200)
   • LDL Cholesterol: 135 mg/dL (elevated, target: <100)
   • Triglycerides: 165 mg/dL (mildly elevated, target: <150)
   
   Recommendation: Your cholesterol levels suggest increased cardiovascular risk. Consider dietary modifications including reduced saturated fat intake, increased fiber consumption, and regular aerobic exercise. Omega-3 supplementation may also be beneficial.

2. Glucose (Low Priority):
   • Fasting Glucose: 105 mg/dL (slightly elevated, target: 70-100)
   
   Recommendation: Your glucose level indicates prediabetic range. This is an early warning sign. Focus on reducing refined carbohydrates, increasing physical activity, and maintaining a healthy weight to prevent progression to diabetes.

3. Hemoglobin (Low Priority):
   • Hemoglobin: 13.2 g/dL (slightly below normal range)
   
   Recommendation: Mildly low hemoglobin may indicate early iron deficiency or anemia. Ensure adequate dietary iron intake through lean meats, leafy greens, and legumes. Consider iron supplementation if symptoms of fatigue persist.

4. Vitamin D (Moderate Priority):
   • Vitamin D: 28 ng/mL (deficient, target: 30-100)
   
   Recommendation: Vitamin D deficiency is common and can affect bone health, immune function, and mood. Increase sun exposure (15-20 minutes daily) and consider supplementation of 1000-2000 IU daily.

POSITIVE HIGHLIGHTS:
• Excellent kidney function with optimal BUN and creatinine levels
• Healthy liver enzymes indicating good liver health
• Normal thyroid function (TSH in optimal range)
• Good vitamin B12 levels
• Healthy white blood cell count indicating strong immune system

RECOMMENDED ACTIONS:
1. Schedule a follow-up appointment with your healthcare provider to discuss lipid management
2. Implement dietary changes focusing on heart-healthy fats and reduced refined sugars
3. Begin or increase regular cardiovascular exercise (150 minutes/week recommended)
4. Start vitamin D supplementation and retest in 3 months
5. Retest glucose and lipid panel in 3-6 months to monitor progress

LIFESTYLE RECOMMENDATIONS:
• Nutrition: Mediterranean-style diet rich in vegetables, whole grains, fish, and healthy fats
• Exercise: 30 minutes of moderate aerobic activity 5 days per week
• Sleep: Aim for 7-9 hours of quality sleep per night
• Stress: Incorporate stress-reduction techniques like meditation or yoga
• Hydration: Maintain adequate water intake (8-10 glasses daily)

IMPORTANT NOTE:
This analysis is based on a single blood test and AI interpretation. Individual results should always be interpreted by a qualified healthcare professional who can consider your complete medical history, symptoms, and other clinical factors. Some values may be affected by recent diet, hydration status, or medications. Always consult with your physician before making significant changes to your health regimen or starting new supplements.

NEXT STEPS:
Please share these results with your primary care physician for personalized medical advice and to determine if any additional testing or intervention is needed.`;

// Historical test data for evolution tracking
export const HISTORICAL_TESTS: BloodTest[] = [
  {
    id: "test-1",
    date: "2025-04-15",
    biomarkers: [
      { id: "glucose", name: "Glucose", value: 115, unit: "mg/dL", referenceRange: { min: 70, max: 100 }, category: "Metabolic Panel" },
      { id: "total_cholesterol", name: "Total Cholesterol", value: 235, unit: "mg/dL", referenceRange: { min: 0, max: 200 }, category: "Lipid Panel" },
      { id: "ldl", name: "LDL Cholesterol", value: 155, unit: "mg/dL", referenceRange: { min: 0, max: 100 }, category: "Lipid Panel" },
      { id: "hdl", name: "HDL Cholesterol", value: 48, unit: "mg/dL", referenceRange: { min: 40, max: 200 }, category: "Lipid Panel" },
      { id: "triglycerides", name: "Triglycerides", value: 185, unit: "mg/dL", referenceRange: { min: 0, max: 150 }, category: "Lipid Panel" },
      { id: "hemoglobin", name: "Hemoglobin", value: 12.8, unit: "g/dL", referenceRange: { min: 13.5, max: 17.5 }, category: "Complete Blood Count" },
      { id: "vitamin_d", name: "Vitamin D", value: 22, unit: "ng/mL", referenceRange: { min: 30, max: 100 }, category: "Vitamins & Minerals" },
      { id: "tsh", name: "TSH", value: 2.3, unit: "mIU/L", referenceRange: { min: 0.4, max: 4.0 }, category: "Thyroid Function" },
      { id: "alt", name: "ALT (SGPT)", value: 32, unit: "U/L", referenceRange: { min: 7, max: 56 }, category: "Liver Function" },
      { id: "creatinine", name: "Creatinine", value: 1.1, unit: "mg/dL", referenceRange: { min: 0.7, max: 1.3 }, category: "Metabolic Panel" },
      { id: "monocytes", name: "Monocytes", value: 6, unit: "%", referenceRange: { min: 2, max: 10 }, category: "Complete Blood Count"},
    ]
  },
  {
    id: "test-2",
    date: "2025-06-20",
    biomarkers: [
      { id: "glucose", name: "Glucose", value: 110, unit: "mg/dL", referenceRange: { min: 70, max: 100 }, category: "Metabolic Panel" },
      { id: "total_cholesterol", name: "Total Cholesterol", value: 225, unit: "mg/dL", referenceRange: { min: 0, max: 200 }, category: "Lipid Panel" },
      { id: "ldl", name: "LDL Cholesterol", value: 145, unit: "mg/dL", referenceRange: { min: 0, max: 100 }, category: "Lipid Panel" },
      { id: "hdl", name: "HDL Cholesterol", value: 50, unit: "mg/dL", referenceRange: { min: 40, max: 200 }, category: "Lipid Panel" },
      { id: "triglycerides", name: "Triglycerides", value: 175, unit: "mg/dL", referenceRange: { min: 0, max: 150 }, category: "Lipid Panel" },
      { id: "hemoglobin", name: "Hemoglobin", value: 13.0, unit: "g/dL", referenceRange: { min: 13.5, max: 17.5 }, category: "Complete Blood Count" },
      { id: "vitamin_d", name: "Vitamin D", value: 25, unit: "ng/mL", referenceRange: { min: 30, max: 100 }, category: "Vitamins & Minerals" },
      { id: "tsh", name: "TSH", value: 2.2, unit: "mIU/L", referenceRange: { min: 0.4, max: 4.0 }, category: "Thyroid Function" },
      { id: "alt", name: "ALT (SGPT)", value: 30, unit: "U/L", referenceRange: { min: 7, max: 56 }, category: "Liver Function" },
      { id: "creatinine", name: "Creatinine", value: 1.0, unit: "mg/dL", referenceRange: { min: 0.7, max: 1.3 }, category: "Metabolic Panel" },
      { id: "monocytes", name: "Monocytes", value: 6, unit: "%", referenceRange: { min: 2, max: 10 }, category: "Complete Blood Count"},
    ]
  },
  {
    id: "test-3",
    date: "2025-08-25",
    biomarkers: [
      { id: "glucose", name: "Glucose", value: 108, unit: "mg/dL", referenceRange: { min: 70, max: 100 }, category: "Metabolic Panel" },
      { id: "total_cholesterol", name: "Total Cholesterol", value: 218, unit: "mg/dL", referenceRange: { min: 0, max: 200 }, category: "Lipid Panel" },
      { id: "ldl", name: "LDL Cholesterol", value: 140, unit: "mg/dL", referenceRange: { min: 0, max: 100 }, category: "Lipid Panel" },
      { id: "hdl", name: "HDL Cholesterol", value: 51, unit: "mg/dL", referenceRange: { min: 40, max: 200 }, category: "Lipid Panel" },
      { id: "triglycerides", name: "Triglycerides", value: 170, unit: "mg/dL", referenceRange: { min: 0, max: 150 }, category: "Lipid Panel" },
      { id: "hemoglobin", name: "Hemoglobin", value: 13.1, unit: "g/dL", referenceRange: { min: 13.5, max: 17.5 }, category: "Complete Blood Count" },
      { id: "vitamin_d", name: "Vitamin D", value: 27, unit: "ng/mL", referenceRange: { min: 30, max: 100 }, category: "Vitamins & Minerals" },
      { id: "tsh", name: "TSH", value: 2.1, unit: "mIU/L", referenceRange: { min: 0.4, max: 4.0 }, category: "Thyroid Function" },
      { id: "alt", name: "ALT (SGPT)", value: 29, unit: "U/L", referenceRange: { min: 7, max: 56 }, category: "Liver Function" },
      { id: "creatinine", name: "Creatinine", value: 1.0, unit: "mg/dL", referenceRange: { min: 0.7, max: 1.3 }, category: "Metabolic Panel" },
      { id: "monocytes", name: "Monocytes", value: 6, unit: "%", referenceRange: { min: 2, max: 10 }, category: "Complete Blood Count"},
    ]
  },
  {
    id: "test-4",
    date: "2025-10-11",
    biomarkers: SAMPLE_BIOMARKERS
  }
];
