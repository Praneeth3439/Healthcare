export type VitalCategory = 'normal' | 'elevated' | 'alert' | 'unspecified';

export interface HealthObservation {
  id: string;
  userId: string;
  timestamp: string; // ISO 8601 string
  heartRate?: number; // bpm
  systolicBp?: number; // mmHg
  diastolicBp?: number; // mmHg
  bloodGlucose?: number; // mg/dL (fasting or random)
  temperature?: number; // Fahrenheit
  oxygenSaturation?: number; // % SpO2
  respiratoryRate?: number; // breaths/min
  weight?: number; // kg
  notes?: string;
  category?: VitalCategory;
}

export interface VitalRanges {
  min: number;
  max: number;
  unit: string;
  normalMin: number;
  normalMax: number;
  label: string;
}
