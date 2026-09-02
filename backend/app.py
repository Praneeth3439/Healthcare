"""
HEALTHCARE REST API Server — Production Entry Point for Render
Compatible with Render Web Services and Vercel Frontend.

Endpoints:
  GET  /health
  GET  /
  GET  /states
  GET  /cities
  GET  /institutions
  GET  /institutions/search
  GET  /institutions/nearby
  GET  /institutions/<id>
  POST /screening
  GET  /screening/history
  POST /monitoring
  GET  /monitoring
  GET  /profile
  PUT  /profile
  GET  /saved-institutions
  POST /saved-institutions
"""

import os
import sys
import json
import math
import time
from typing import Dict, Any, List, Optional
from flask import Flask, request, jsonify
from flask_cors import CORS

# Ensure backend root is in sys.path for submodule imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

# Initialize Flask application
app = Flask(__name__)

# Configure CORS
# Allow Vercel frontend domains, local development, or configured origins via environment
cors_origins_env = os.environ.get('CORS_ORIGINS', '*')
if cors_origins_env == '*':
    allowed_origins: Any = '*'
else:
    allowed_origins = [origin.strip() for origin in cors_origins_env.split(',') if origin.strip()]

CORS(
    app,
    resources={r"/*": {"origins": allowed_origins}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"]
)

# ----------------------------------------------------------------------
# 1. Dataset Loading (Official NIRF 2025 Medical Colleges)
# ----------------------------------------------------------------------
def get_dataset_path() -> str:
    potential_paths = [
        os.path.join(os.path.dirname(__file__), 'functions', 'institutions', 'nirf_data.json'),
        os.path.join(os.path.dirname(__file__), '..', 'data', 'processed', 'nirf_medical_2025_processed.json'),
        os.path.join(os.path.dirname(__file__), 'nirf_data.json'),
    ]
    for path in potential_paths:
        if os.path.exists(path):
            return os.path.abspath(path)
    return potential_paths[0]

DATA_PATH = get_dataset_path()
INSTITUTIONS: List[Dict[str, Any]] = []

try:
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        INSTITUTIONS = json.load(f)
except Exception as e:
    # Graceful fallback attempt
    alt_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed', 'nirf_medical_2025_processed.json')
    if os.path.exists(alt_path):
        with open(alt_path, 'r', encoding='utf-8') as f:
            INSTITUTIONS = json.load(f)


# ----------------------------------------------------------------------
# 2. Geospatial Utilities
# ----------------------------------------------------------------------
def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates geodesic distance in kilometers between two lat/long points."""
    r = 6371.0  # Earth radius in kilometers
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 1)


# ----------------------------------------------------------------------
# 3. In-Memory State & Fallback Stores
# ----------------------------------------------------------------------
LOCAL_OBSERVATIONS: List[Dict[str, Any]] = [
    {
        'id': 'obs-init-1',
        'userId': 'usr-demo',
        'timestamp': '2025-02-28T08:30:00Z',
        'heartRate': 72,
        'systolicBp': 118,
        'diastolicBp': 78,
        'bloodGlucose': 92,
        'temperature': 98.4,
        'oxygenSaturation': 98,
        'respiratoryRate': 16,
        'weight': 68.5,
        'category': 'normal',
        'notes': 'Routine baseline vitals',
    }
]

LOCAL_SCREENING_STORE: List[Dict[str, Any]] = []

DEMO_PROFILE: Dict[str, Any] = {
    'id': 'usr-demo-001',
    'fullName': 'Dr. Sarah Jenkins',
    'email': 'sarah.jenkins@healthcare.org',
    'phoneNumber': '+91 98765 43210',
    'city': 'New Delhi',
    'state': 'Delhi',
    'userType': 'Healthcare Professional',
    'createdAt': '2025-01-15T09:00:00Z',
}

DEMO_SAVED_IDS: List[str] = ['nirf-med-001', 'nirf-med-003']


# ----------------------------------------------------------------------
# 4. Screening Evaluation Engine
# ----------------------------------------------------------------------
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
    symptoms = data.get('symptoms', [])

    # 1. BMI Calculation
    bmi, bmi_cat = calculate_bmi(height_cm, weight_kg)
    if bmi >= 30:
        score += 20
        factors.append({'factor': 'Body Mass Index (Obese)', 'weight': 20, 'severity': 'high', 'description': f'BMI is {bmi} ({bmi_cat}).'})
        recommendations.append('Consult a registered dietitian and primary physician for personalized weight and metabolic care.')
    elif bmi >= 25:
        score += 10
        factors.append({'factor': 'Body Mass Index (Overweight)', 'weight': 10, 'severity': 'moderate', 'description': f'BMI is {bmi} ({bmi_cat}).'})

    # 2. Age Factor
    if age >= 60:
        score += 15
        factors.append({'factor': 'Age >= 60', 'weight': 15, 'severity': 'moderate', 'description': 'Age is an established non-modifiable cardiovascular baseline factor.'})
    elif age >= 45:
        score += 8
        factors.append({'factor': 'Age 45–59', 'weight': 8, 'severity': 'mild', 'description': 'Annual routine preventive health checks recommended.'})

    # 3. Smoking Factor
    if smoking == 'current':
        score += 25
        factors.append({'factor': 'Active Tobacco Use', 'weight': 25, 'severity': 'high', 'description': 'Tobacco is a primary modifiable risk for cardiac and vascular diseases.'})
        recommendations.append('Prioritize structured smoking cessation or nicotine replacement therapy.')
    elif smoking == 'former':
        score += 5
        factors.append({'factor': 'Past Tobacco Use', 'weight': 5, 'severity': 'mild', 'description': 'Residual cardiovascular history factor.'})

    # 4. Physical Activity
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


# ----------------------------------------------------------------------
# 5. Core REST API Endpoints
# ----------------------------------------------------------------------

@app.route('/health', methods=['GET'])
def health():
    """Service health check endpoint returning JSON status."""
    return jsonify({
        'status': 'healthy',
        'service': 'healthcare-api',
        'version': '1.0.0',
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'institutions_loaded': len(INSTITUTIONS),
        'environment': os.environ.get('RENDER_ENVIRONMENT', os.environ.get('ENV', 'production'))
    }), 200


@app.route('/', methods=['GET'])
def root():
    """Root metadata and API index endpoint."""
    return jsonify({
        'service': 'HEALTHCARE REST API',
        'description': 'Medical institutions discovery, vital signs telemetry, and risk screening API',
        'version': '1.0.0',
        'health': '/health',
        'endpoints': [
            '/health',
            '/states',
            '/cities',
            '/institutions',
            '/institutions/search',
            '/institutions/nearby',
            '/institutions/<id>',
            '/screening',
            '/screening/history',
            '/monitoring',
            '/profile',
            '/saved-institutions'
        ]
    }), 200


# --- Institutions Endpoints ---

@app.route('/states', methods=['GET'])
def get_states():
    """Returns list of unique States and Union Territories with medical colleges."""
    states = sorted(list({i['state'] for i in INSTITUTIONS if i.get('state')}))
    return jsonify({'states': states, 'count': len(states)}), 200


@app.route('/cities', methods=['GET'])
def get_cities():
    """Returns list of unique cities, optionally filtered by state."""
    state_filter = request.args.get('state')
    if state_filter and state_filter.lower() != 'all':
        cities = sorted(list({i['city'] for i in INSTITUTIONS if i.get('city') and i.get('state', '').lower() == state_filter.lower()}))
    else:
        cities = sorted(list({i['city'] for i in INSTITUTIONS if i.get('city')}))
    return jsonify({'cities': cities, 'count': len(cities)}), 200


@app.route('/institutions', methods=['GET'])
@app.route('/institutions/search', methods=['GET'])
def get_institutions():
    """
    Search and filter medical institutions by state, city, keyword search, or max rank.
    """
    state = request.args.get('state')
    city = request.args.get('city')
    search_q = request.args.get('q') or request.args.get('search')
    max_rank = request.args.get('max_rank')

    filtered = list(INSTITUTIONS)

    if state and state.lower() != 'all':
        filtered = [i for i in filtered if i.get('state', '').lower() == state.lower()]

    if city and city.lower() != 'all':
        filtered = [i for i in filtered if i.get('city', '').lower() == city.lower()]

    if max_rank:
        try:
            mr = int(max_rank)
            filtered = [i for i in filtered if i.get('nirf_rank') and i['nirf_rank'] <= mr]
        except ValueError:
            pass

    if search_q:
        q = search_q.lower()
        filtered = [
            i for i in filtered if
            q in i.get('name', '').lower() or
            q in i.get('city', '').lower() or
            q in i.get('state', '').lower() or
            q in i.get('address', '').lower()
        ]

    # Sort by NIRF Rank
    filtered.sort(key=lambda x: x.get('nirf_rank') or 999)

    return jsonify({
        'institutions': filtered,
        'count': len(filtered),
        'total': len(INSTITUTIONS)
    }), 200


@app.route('/institutions/nearby', methods=['GET'])
def get_nearby_institutions():
    """Finds institutions within a radius (km) of specified lat/lng coordinates."""
    try:
        user_lat = float(request.args.get('lat', 0))
        user_lng = float(request.args.get('lng', 0))
        radius_km = float(request.args.get('radius', 200))
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid lat, lng, or radius query parameters.'}), 400

    results = []
    for inst in INSTITUTIONS:
        if inst.get('latitude') is not None and inst.get('longitude') is not None:
            dist = haversine_distance(user_lat, user_lng, inst['latitude'], inst['longitude'])
            if dist <= radius_km:
                item = dict(inst)
                item['distance_km'] = dist
                results.append(item)

    results.sort(key=lambda x: x['distance_km'])
    return jsonify({
        'institutions': results,
        'count': len(results),
        'radius_km': radius_km
    }), 200


@app.route('/institutions/<path:institution_id>', methods=['GET'])
def get_institution_by_id(institution_id: str):
    """Fetches full details of a specific institution by its ID or rank."""
    found = next((i for i in INSTITUTIONS if i['id'] == institution_id or str(i.get('nirf_rank')) == institution_id), None)
    if found:
        return jsonify(found), 200
    return jsonify({'error': f'Institution with ID {institution_id} not found.'}), 404


# --- Screening Endpoints ---

@app.route('/screening', methods=['POST'])
def post_screening():
    """Evaluates health risk screening input and returns calculated score and recommendations."""
    try:
        body = request.get_json(force=True, silent=True) or {}
        input_data = body.get('input', body)
        result = evaluate_screening(input_data)

        # Optional DynamoDB persistence if configured
        table_name = os.environ.get('SCREENING_TABLE_NAME')
        if table_name:
            try:
                import boto3
                dynamodb = boto3.resource('dynamodb')
                table = dynamodb.Table(table_name)
                table.put_item(Item=result)
            except Exception:
                LOCAL_SCREENING_STORE.append(result)
        else:
            LOCAL_SCREENING_STORE.append(result)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/screening/history', methods=['GET'])
def get_screening_history():
    """Returns list of past screenings."""
    return jsonify({'history': LOCAL_SCREENING_STORE, 'count': len(LOCAL_SCREENING_STORE)}), 200


# --- Remote Monitoring Endpoints ---

@app.route('/monitoring', methods=['GET', 'POST'])
def monitoring():
    """Handles logging and retrieving remote patient vitals observations."""
    if request.method == 'POST':
        try:
            body = request.get_json(force=True, silent=True) or {}
            obs_id = body.get('id') or f"obs-{int(time.time() * 1000)}"
            timestamp = body.get('timestamp') or time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

            record = {
                'id': obs_id,
                'userId': body.get('userId', 'usr-demo'),
                'timestamp': timestamp,
                'heartRate': body.get('heartRate'),
                'systolicBp': body.get('systolicBp'),
                'diastolicBp': body.get('diastolicBp'),
                'bloodGlucose': body.get('bloodGlucose'),
                'temperature': body.get('temperature'),
                'oxygenSaturation': body.get('oxygenSaturation'),
                'respiratoryRate': body.get('respiratoryRate'),
                'weight': body.get('weight'),
                'category': body.get('category', 'normal'),
                'notes': body.get('notes', ''),
            }

            table_name = os.environ.get('OBSERVATIONS_TABLE_NAME')
            if table_name:
                try:
                    import boto3
                    dynamodb = boto3.resource('dynamodb')
                    table = dynamodb.Table(table_name)
                    table.put_item(Item=record)
                except Exception:
                    LOCAL_OBSERVATIONS.insert(0, record)
            else:
                LOCAL_OBSERVATIONS.insert(0, record)

            return jsonify(record), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    # GET /monitoring
    return jsonify({'observations': LOCAL_OBSERVATIONS, 'count': len(LOCAL_OBSERVATIONS)}), 200


# --- User Profile & Saved Institutions Endpoints ---

@app.route('/profile', methods=['GET', 'PUT'])
def profile():
    """Retrieves or updates user profile."""
    if request.method == 'PUT':
        try:
            body = request.get_json(force=True, silent=True) or {}
            DEMO_PROFILE.update(body)
            return jsonify(DEMO_PROFILE), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    return jsonify(DEMO_PROFILE), 200


@app.route('/saved-institutions', methods=['GET', 'POST'])
def saved_institutions():
    """Retrieves or toggles saved/bookmarked institutions."""
    if request.method == 'POST':
        try:
            body = request.get_json(force=True, silent=True) or {}
            inst_id = body.get('institutionId')
            if inst_id:
                if inst_id in DEMO_SAVED_IDS:
                    DEMO_SAVED_IDS.remove(inst_id)
                else:
                    DEMO_SAVED_IDS.append(inst_id)
            return jsonify({'savedIds': DEMO_SAVED_IDS}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    return jsonify({'savedIds': DEMO_SAVED_IDS}), 200


# ----------------------------------------------------------------------
# 6. Error Handlers
# ----------------------------------------------------------------------
@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad Request', 'message': str(error)}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource Not Found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method Not Allowed'}), 405

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal Server Error'}), 500


# ----------------------------------------------------------------------
# 7. Local Development & Standalone Server Entry Point
# ----------------------------------------------------------------------
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    print(f"Starting HEALTHCARE REST API on {host}:{port} (Loaded {len(INSTITUTIONS)} institutions)")
    app.run(host=host, port=port, debug=debug_mode)
