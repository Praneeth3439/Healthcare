import { ScreeningInput, ScreeningResult, RiskFactor, RiskLevel } from '../types/screening';

export function calculateBMI(heightCm: number, weightKg: number): { bmi: number; category: string } {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'Unknown' };
  }
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  let category = 'Normal weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 18.5 && bmi < 24.9) category = 'Normal weight';
  else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
  else category = 'Obese';

  return { bmi, category };
}

export function evaluateEarlyHealthRisk(input: ScreeningInput): ScreeningResult {
  let score = 0;
  const factors: RiskFactor[] = [];
  const recommendations: string[] = [];

  // 1. BMI Factor
  const { bmi, category: bmiCategory } = calculateBMI(input.heightCm, input.weightKg);
  if (bmi >= 30) {
    score += 20;
    factors.push({
      factor: 'Body Mass Index (Obese)',
      weight: 20,
      severity: 'high',
      description: `BMI is ${bmi} (${bmiCategory}), which increases baseline cardiovascular and metabolic risk.`
    });
    recommendations.push('Consider a balanced nutrition plan and consulting a dietitian for weight management.');
  } else if (bmi >= 25) {
    score += 10;
    factors.push({
      factor: 'Body Mass Index (Overweight)',
      weight: 10,
      severity: 'moderate',
      description: `BMI is ${bmi} (${bmiCategory}), indicating potential benefit from increased physical activity.`
    });
  }

  // 2. Age Factor
  if (input.age >= 60) {
    score += 15;
    factors.push({
      factor: 'Age >= 60',
      weight: 15,
      severity: 'moderate',
      description: 'Advancing age is an established non-modifiable factor for cardiovascular and chronic health risks.'
    });
  } else if (input.age >= 45) {
    score += 8;
    factors.push({
      factor: 'Age 45–59',
      weight: 8,
      severity: 'mild',
      description: 'Routine annual preventive screening is recommended for this age bracket.'
    });
  }

  // 3. Smoking & Tobacco
  if (input.smokingStatus === 'current') {
    score += 25;
    factors.push({
      factor: 'Current Tobacco/Smoking Use',
      weight: 25,
      severity: 'high',
      description: 'Active tobacco use is a leading primary risk factor for vascular, cardiac, and respiratory conditions.'
    });
    recommendations.push('Prioritize smoking cessation programs or consult a physician for nicotine replacement guidance.');
  } else if (input.smokingStatus === 'former') {
    score += 5;
    factors.push({
      factor: 'Former Tobacco Use',
      weight: 5,
      severity: 'mild',
      description: 'Past smoking history carries lingering cardiovascular residual risk.'
    });
  }

  // 4. Physical Activity
  if (input.activityLevel === 'sedentary') {
    score += 12;
    factors.push({
      factor: 'Sedentary Lifestyle',
      weight: 12,
      severity: 'moderate',
      description: 'Low physical activity correlates with decreased insulin sensitivity and higher resting blood pressure.'
    });
    recommendations.push('Aim for at least 150 minutes of moderate aerobic exercise (e.g., brisk walking) per week.');
  }

  // 5. Medical History & Chronic Factors
  if (input.hasHypertensionHistory) {
    score += 18;
    factors.push({
      factor: 'History of Hypertension',
      weight: 18,
      severity: 'high',
      description: 'Personal history of elevated blood pressure requires routine monitoring and sodium moderation.'
    });
    recommendations.push('Monitor systolic and diastolic blood pressure weekly and log readings in Remote Monitoring.');
  }

  if (input.hasDiabetesHistory) {
    score += 18;
    factors.push({
      factor: 'History of Diabetes / Glycemic Dysregulation',
      weight: 18,
      severity: 'high',
      description: 'Diabetes significantly influences microvascular and macrovascular health.'
    });
    recommendations.push('Maintain regular fasting glucose and HbA1c screening with an endocrinologist or primary doctor.');
  }

  if (input.hasFamilyHeartDisease) {
    score += 10;
    factors.push({
      factor: 'Family History of Premature Cardiovascular Disease',
      weight: 10,
      severity: 'moderate',
      description: 'Genetic predisposition contributes to baseline lipid and arterial health profile.'
    });
  }

  // 6. Blood Pressure Observation if provided
  if (input.systolicBp && input.systolicBp >= 140) {
    score += 15;
    factors.push({
      factor: `Elevated Systolic BP (${input.systolicBp} mmHg)`,
      weight: 15,
      severity: 'high',
      description: 'Recent blood pressure reading indicates Stage 2 hypertension range.'
    });
  }

  // 7. Symptoms
  if (input.symptoms && input.symptoms.length > 0) {
    const highAlertSymptoms = ['Chest tightness or discomfort', 'Shortness of breath on mild exertion', 'Dizziness or lightheadedness'];
    let symptomScore = 0;
    input.symptoms.forEach((sym) => {
      if (highAlertSymptoms.includes(sym)) {
        symptomScore += 12;
      } else {
        symptomScore += 5;
      }
    });
    score += Math.min(symptomScore, 25);
    factors.push({
      factor: `Reported Symptoms (${input.symptoms.length})`,
      weight: Math.min(symptomScore, 25),
      severity: symptomScore > 15 ? 'high' : 'moderate',
      description: `Symptoms reported: ${input.symptoms.join(', ')}.`
    });
    recommendations.push('Prompt clinical evaluation by a medical professional is strongly advised for current symptoms.');
  }

  // Clamp score 0 to 100
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  let overallRisk: RiskLevel = 'Low Risk';
  if (normalizedScore >= 60) {
    overallRisk = 'Higher Risk';
  } else if (normalizedScore >= 30) {
    overallRisk = 'Moderate Risk';
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain healthy lifestyle habits and complete routine annual preventive checkups.');
  }

  return {
    id: `scr-${Date.now()}`,
    timestamp: new Date().toISOString(),
    overallRisk,
    riskScore: normalizedScore,
    bmi,
    bmiCategory,
    contributingFactors: factors,
    recommendations,
    recommendedInstitutionRanks: overallRisk === 'Higher Risk' ? [1, 2, 3, 4, 5] : [1, 2, 3],
    disclaimer:
      'This screening provides an informational risk assessment and does not constitute a medical diagnosis. Consult a qualified healthcare professional for diagnosis and treatment.'
  };
}
