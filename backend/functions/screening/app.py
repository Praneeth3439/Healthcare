"""
AWS Lambda Handler: Early Health-Risk Screening API
Endpoints:
  POST /screening
  GET /screening/history
"""

import os
import json
import time
from typing import Dict, Any, List

TABLE_NAME = os.environ.get('SCREENING_TABLE_NAME', 'ScreeningResultsTable')

# In-memory store fallback for local / non-AWS test environments
LOCAL_STORE: List[Dict[str, Any]] = []


def calculate_bmi(height_cm: float, weight_kg: float) -> tuple[float, str]:
    if height_cm <= 0 or weight_kg <= 0:
        return 0.0, 'Unknown'
    h_m = height_cm / 100.0
    bmi = round(weight_kg / (h_m * h_m), 1)
    if bmi < 18.5:
        category = 'Underweight'
    elif bmi < 24.9:
        category = 'Normal weight'
    elif bmi < 29.9:
        category = 'Overweight'
    else:
        category = 'Obese'
    return bmi, category


def evaluate_screening(data: Dict[str, Any]) -> Dict[str, Any]:
    score = 0
    factors = []
    recommendations = []

    age = int(data.get('age', 30))
    height_cm = float(data.get('heightCm', 170))
    weight_kg = float(data.get('weightKg', 70))
    activity = data.get('activityLevel', 'moderate')
    smoking = data.get('smokingStatus', 'never')
    has_htn = bool(data.get('hasHypertensionHistory', False))
    has_dm = bool(data.get('hasDiabetesHistory', False))
    has_fam_hd = bool(data.get('hasFamilyHeartDisease', False))
    systolic = float(data.get('systolicBp', 0)) if data.get('systolicBp') else None
    symptoms = data.get('symptoms', [])

    # 1. BMI
    bmi, bmi_cat = calculate_bmi(height_cm, weight_kg)
    if bmi >= 30:
        score += 20
        factors.append({'factor': 'Body Mass Index (Obese)', 'weight': 20, 'severity': 'high', 'description': f'BMI is {bmi} ({bmi_cat}).'})
        recommendations.append('Consult a registered dietitian and primary physician for personalized weight and metabolic care.')
    elif bmi >= 25:
        score += 10
        factors.append({'factor': 'Body Mass Index (Overweight)', 'weight': 10, 'severity': 'moderate', 'description': f'BMI is {bmi} ({bmi_cat}).'})

    # 2. Age
    if age >= 60:
        score += 15
        factors.append({'factor': 'Age >= 60', 'weight': 15, 'severity': 'moderate', 'description': 'Age is an established non-modifiable cardiovascular baseline factor.'})
    elif age >= 45:
        score += 8
        factors.append({'factor': 'Age 45–59', 'weight': 8, 'severity': 'mild', 'description': 'Annual routine preventive health checks recommended.'})

    # 3. Smoking
    if smoking == 'current':
        score += 25
        factors.append({'factor': 'Active Tobacco Use', 'weight': 25, 'severity': 'high', 'description': 'Tobacco is a primary modifiable risk for cardiac and vascular diseases.'})
        recommendations.append('Prioritize structured smoking cessation or nicotine replacement therapy.')
    elif smoking == 'former':
        score += 5
        factors.append({'factor': 'Past Tobacco Use', 'weight': 5, 'severity': 'mild', 'description': 'Residual cardiovascular history factor.'})

    # 4. Activity
    if activity == 'sedentary':
        score += 12
        factors.append({'factor': 'Sedentary Lifestyle', 'weight': 12, 'severity': 'moderate', 'description': 'Low weekly physical activity increases metabolic risk.'})
        recommendations.append('Engage in 150+ minutes of moderate weekly physical activity like brisk walking.')

    # 5. Medical History
    if has_htn:
        score += 18
        factors.append({'factor': 'History of Hypertension', 'weight': 18, 'severity': 'high', 'description': 'Personal diagnosis of high blood pressure.'})
        recommendations.append('Maintain routine weekly blood pressure logs in the Remote Monitoring portal.')

    if has_dm:
        score += 18
        factors.append({'factor': 'History of Diabetes / Glycemic Dysregulation', 'weight': 18, 'severity': 'high', 'description': 'Diabetes significantly impacts vascular health.'})
        recommendations.append('Schedule periodic fasting glucose and HbA1c reviews with an endocrinologist.')

    if has_fam_hd:
        score += 10
        factors.append({'factor': 'Family History of Premature Heart Disease', 'weight': 10, 'severity': 'moderate', 'description': 'Genetic family background.'})

    # 6. Symptoms
    if symptoms:
        sym_score = min(len(symptoms) * 8, 25)
        score += sym_score
        factors.append({'factor': f'Reported Symptoms ({len(symptoms)})', 'weight': sym_score, 'severity': 'high' if sym_score > 15 else 'moderate', 'description': f"Symptoms: {', '.join(symptoms)}."})
        recommendations.append('Prompt medical evaluation by a licensed physician is strongly advised for currently active symptoms.')

    normalized_score = min(max(score, 0), 100)
    if normalized_score >= 60:
        overall_risk = 'Higher Risk'
    elif normalized_score >= 30:
        overall_risk = 'Moderate Risk'
    else:
        overall_risk = 'Low Risk'

    if not recommendations:
        recommendations.append('Maintain active healthy habits and complete regular annual preventive screenings.')

    result = {
        'id': f'scr-{int(time.time() * 1000)}',
        'userId': data.get('userId', 'usr-anonymous'),
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'overallRisk': overall_risk,
        'riskScore': normalized_score,
        'bmi': bmi,
        'bmiCategory': bmi_cat,
        'contributingFactors': factors,
        'recommendations': recommendations,
        'recommendedInstitutionRanks': [1, 2, 3, 4, 5] if overall_risk == 'Higher Risk' else [1, 2, 3],
        'disclaimer': 'This screening provides an informational risk assessment and does not constitute a medical diagnosis. Consult a qualified healthcare professional for diagnosis and treatment.'
    }
    return result


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', 'GET')

    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            },
            'body': json.dumps({'status': 'ok'})
        }

    if http_method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            input_data = body.get('input', body)
            result = evaluate_screening(input_data)

            # Try saving to DynamoDB if running in AWS
            try:
                import boto3
                dynamodb = boto3.resource('dynamodb')
                table = dynamodb.Table(TABLE_NAME)
                table.put_item(Item=result)
            except Exception:
                LOCAL_STORE.append(result)

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, ensure_ascii=False)
            }
        except Exception as e:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }

    # GET /screening/history
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'history': LOCAL_STORE, 'count': len(LOCAL_STORE)})
    }
