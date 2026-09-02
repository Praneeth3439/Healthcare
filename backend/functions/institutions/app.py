"""
AWS Lambda Handler: Medical Institutions API
Endpoints:
  GET /institutions
  GET /institutions/{id}
  GET /institutions/search
  GET /institutions/nearby
  GET /states
  GET /cities
"""

import os
import json
import math
from typing import Dict, Any, List, Optional

# Load bundled verified dataset
DATA_PATH = os.path.join(os.path.dirname(__file__), 'nirf_data.json')
if not os.path.exists(DATA_PATH):
    # Fallback path if running from root or during tests
    DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'processed', 'nirf_medical_2025_processed.json')

try:
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        INSTITUTIONS: List[Dict[str, Any]] = json.load(f)
except Exception as e:
    INSTITUTIONS = []


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance in kilometers between two lat/long points."""
    r = 6371.0  # Earth's radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 1)


def build_response(status_code: int, body: Any) -> Dict[str, Any]:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
        'body': json.dumps(body, ensure_ascii=False)
    }


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', 'GET')
    path = event.get('path') or event.get('rawPath', '')
    path_parameters = event.get('pathParameters') or {}
    query_parameters = event.get('queryStringParameters') or {}

    # Handle CORS preflight
    if http_method == 'OPTIONS':
        return build_response(200, {'status': 'ok'})

    # 1. GET /states
    if path.endswith('/states'):
        states = sorted(list({i['state'] for i in INSTITUTIONS if i.get('state')}))
        return build_response(200, {'states': states, 'count': len(states)})

    # 2. GET /cities
    if path.endswith('/cities'):
        state_filter = query_parameters.get('state')
        if state_filter:
            cities = sorted(list({i['city'] for i in INSTITUTIONS if i.get('city') and i.get('state', '').lower() == state_filter.lower()}))
        else:
            cities = sorted(list({i['city'] for i in INSTITUTIONS if i.get('city')}))
        return build_response(200, {'cities': cities, 'count': len(cities)})

    # 3. GET /institutions/nearby
    if path.endswith('/nearby') or 'nearby' in path:
        try:
            user_lat = float(query_parameters.get('lat', 0))
            user_lng = float(query_parameters.get('lng', 0))
            radius_km = float(query_parameters.get('radius', 200))
        except (ValueError, TypeError):
            return build_response(400, {'error': 'Invalid lat, lng, or radius query parameters.'})

        results = []
        for inst in INSTITUTIONS:
            if inst.get('latitude') is not None and inst.get('longitude') is not None:
                dist = haversine_distance(user_lat, user_lng, inst['latitude'], inst['longitude'])
                if dist <= radius_km:
                    item = dict(inst)
                    item['distance_km'] = dist
                    results.append(item)

        results.sort(key=lambda x: x['distance_km'])
        return build_response(200, {'institutions': results, 'count': len(results), 'radius_km': radius_km})

    # 4. GET /institutions/{id}
    inst_id = path_parameters.get('id')
    if inst_id:
        found = next((i for i in INSTITUTIONS if i['id'] == inst_id or str(i.get('nirf_rank')) == inst_id), None)
        if found:
            return build_response(200, found)
        return build_response(404, {'error': f'Institution with ID {inst_id} not found.'})

    # 5. GET /institutions or GET /institutions/search
    state = query_parameters.get('state')
    city = query_parameters.get('city')
    search_q = query_parameters.get('q') or query_parameters.get('search')
    max_rank = query_parameters.get('max_rank')

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

    # Sort by rank
    filtered.sort(key=lambda x: x.get('nirf_rank') or 999)

    return build_response(200, {
        'institutions': filtered,
        'count': len(filtered),
        'total': len(INSTITUTIONS)
    })
