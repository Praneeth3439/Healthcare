export type RiskLevel = 'Low Risk' | 'Moderate Risk' | 'Higher Risk';

export interface ScreeningInput {
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  smokingStatus: 'never' | 'former' | 'current';
  alcoholIntake: 'none' | 'occasional' | 'regular';
  hasHypertensionHistory: boolean;
  hasDiabetesHistory: boolean;
  hasFamilyHeartDisease: boolean;
  systolicBp?: number;
  fastingGlucose?: number;
  symptoms: string[];
  durationWeeks?: number;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  severity: 'mild' | 'moderate' | 'high';
  description: string;
}

export interface ScreeningResult {
  id: string;
  userId?: string;
  timestamp: string;
  overallRisk: RiskLevel;
  riskScore: number; // 0 to 100
  bmi: number;
  bmiCategory: string;
  contributingFactors: RiskFactor[];
  recommendations: string[];
  recommendedInstitutionRanks: number[];
  disclaimer: string;
}
