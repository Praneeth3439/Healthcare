"""
AWS Lambda Handler: Remote Patient Monitoring API
Endpoints:
  POST /monitoring
  GET /monitoring
"""

import os
import json
import time
from typing import Dict, Any, List

TABLE_NAME = os.environ.get('OBSERVATIONS_TABLE_NAME', 'HealthObservationsTable')

# Local fallback store
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

    # POST /monitoring
    if http_method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
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

            # DynamoDB write attempt
            try:
                import boto3
                dynamodb = boto3.resource('dynamodb')
                table = dynamodb.Table(TABLE_NAME)
                table.put_item(Item=record)
            except Exception:
                LOCAL_OBSERVATIONS.insert(0, record)

            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(record, ensure_ascii=False)
            }
        except Exception as e:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }

    # GET /monitoring
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'observations': LOCAL_OBSERVATIONS, 'count': len(LOCAL_OBSERVATIONS)})
    }
