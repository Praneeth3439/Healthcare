"""
Shared HTTP response utility for AWS Lambda handlers with standardized CORS headers.
"""

import json
from decimal import Decimal
from typing import Any, Dict, Optional


class DecimalEncoder(json.JSONEncoder):
    """Encodes DynamoDB Decimals into Python floats or ints."""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj) if obj % 1 != 0 else int(obj)
        return super(DecimalEncoder, self).default(obj)


def build_response(
    status_code: int,
    body: Any,
    headers: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    default_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Max-Age': '86400',
    }
    if headers:
        default_headers.update(headers)

    return {
        'statusCode': status_code,
        'headers': default_headers,
        'body': json.dumps(body, cls=DecimalEncoder, ensure_ascii=False) if not isinstance(body, str) else body,
    }


def success_response(data: Any, status_code: int = 200) -> Dict[str, Any]:
    return build_response(status_code, data)


def error_response(message: str, status_code: int = 400, details: Optional[Any] = None) -> Dict[str, Any]:
    payload = {'error': message}
    if details:
        payload['details'] = details
    return build_response(status_code, payload)
