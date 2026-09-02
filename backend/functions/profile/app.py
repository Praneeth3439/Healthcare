"""
AWS Lambda Handler: User Profile & Saved Institutions API
Endpoints:
  GET /profile
  PUT /profile
  GET /saved-institutions
  POST /saved-institutions
"""

import os
import json
import time
from typing import Dict, Any, List

USERS_TABLE_NAME = os.environ.get('USERS_TABLE_NAME', 'UsersTable')
SAVED_TABLE_NAME = os.environ.get('SAVED_TABLE_NAME', 'SavedInstitutionsTable')

# Local fallback demo state
DEMO_PROFILE = {
    'id': 'usr-demo-001',
    'fullName': 'Dr. Sarah Jenkins',
    'email': 'sarah.jenkins@healthcare.org',
    'phoneNumber': '+91 98765 43210',
    'city': 'New Delhi',
    'state': 'Delhi',
    'userType': 'Healthcare Professional',
    'createdAt': '2025-01-15T09:00:00Z',
}

DEMO_SAVED_IDS = ['nirf-med-001', 'nirf-med-003']


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', 'GET')
    path = event.get('path') or event.get('rawPath', '')

    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            },
            'body': json.dumps({'status': 'ok'})
        }

    # 1. Saved Institutions endpoints
    if 'saved-institutions' in path:
        if http_method == 'POST':
            try:
                body = json.loads(event.get('body', '{}'))
                inst_id = body.get('institutionId')
                if inst_id:
                    if inst_id in DEMO_SAVED_IDS:
                        DEMO_SAVED_IDS.remove(inst_id)
                    else:
                        DEMO_SAVED_IDS.append(inst_id)

                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'savedIds': DEMO_SAVED_IDS})
                }
            except Exception as e:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': str(e)})
                }

        # GET /saved-institutions
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'savedIds': DEMO_SAVED_IDS})
        }

    # 2. Profile endpoints
    if http_method == 'PUT':
        try:
            body = json.loads(event.get('body', '{}'))
            DEMO_PROFILE.update(body)
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(DEMO_PROFILE, ensure_ascii=False)
            }
        except Exception as e:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }

    # GET /profile
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(DEMO_PROFILE, ensure_ascii=False)
    }
