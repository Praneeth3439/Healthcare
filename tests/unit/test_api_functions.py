#!/usr/bin/env python3
"""
Unit Tests for AWS Lambda Backend Handlers
"""

import unittest
import os
import json
import importlib.util


def load_lambda_module(func_name: str):
    path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'functions', func_name, 'app.py')
    spec = importlib.util.spec_from_file_location(f"{func_name}_module", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


institutions_module = load_lambda_module('institutions')
screening_module = load_lambda_module('screening')
monitoring_module = load_lambda_module('monitoring')
profile_module = load_lambda_module('profile')


class TestLambdaBackendHandlers(unittest.TestCase):
    def test_institutions_get_all(self):
        """GET /institutions returns all 50 colleges with valid status code."""
        event = {'httpMethod': 'GET', 'path': '/institutions', 'queryStringParameters': {}}
        response = institutions_module.lambda_handler(event, None)
        self.assertEqual(response['statusCode'], 200)
        body = json.loads(response['body'])
        self.assertEqual(body['total'], 50)
        self.assertEqual(len(body['institutions']), 50)

    def test_institutions_get_by_id(self):
        """GET /institutions/{id} returns AIIMS New Delhi."""
        event = {'httpMethod': 'GET', 'path': '/institutions/nirf-med-001', 'pathParameters': {'id': 'nirf-med-001'}}
        response = institutions_module.lambda_handler(event, None)
        self.assertEqual(response['statusCode'], 200)
        body = json.loads(response['body'])
        self.assertEqual(body['nirf_rank'], 1)
        self.assertIn('All India Institute of Medical Sciences', body['name'])

    def test_institutions_nearby_search(self):
        """GET /institutions/nearby computes radius filtering correctly."""
        # Query near Delhi (28.61, 77.20) with 100km radius
        event = {
            'httpMethod': 'GET',
            'path': '/institutions/nearby',
            'queryStringParameters': {'lat': '28.61', 'lng': '77.20', 'radius': '100'}
        }
        response = institutions_module.lambda_handler(event, None)
        self.assertEqual(response['statusCode'], 200)
        body = json.loads(response['body'])
        self.assertTrue(len(body['institutions']) >= 5)  # Delhi cluster colleges
        self.assertTrue(all(i['distance_km'] <= 100 for i in body['institutions']))

    def test_screening_post_assessment(self):
        """POST /screening computes assessment and returns 200."""
        payload = {
            'age': 45,
            'heightCm': 170,
            'weightKg': 75,
            'activityLevel': 'light',
            'smokingStatus': 'never',
            'hasHypertensionHistory': False,
            'hasDiabetesHistory': False,
            'hasFamilyHeartDisease': False,
            'symptoms': []
        }
        event = {'httpMethod': 'POST', 'body': json.dumps(payload)}
        response = screening_module.lambda_handler(event, None)
        self.assertEqual(response['statusCode'], 200)
        body = json.loads(response['body'])
        self.assertIn('overallRisk', body)
        self.assertIn('riskScore', body)

    def test_monitoring_post_and_get(self):
        """POST and GET on /monitoring records observation."""
        payload = {
            'heartRate': 75,
            'systolicBp': 120,
            'diastolicBp': 80,
            'bloodGlucose': 95,
            'oxygenSaturation': 98,
        }
        event = {'httpMethod': 'POST', 'body': json.dumps(payload)}
        post_res = monitoring_module.lambda_handler(event, None)
        self.assertEqual(post_res['statusCode'], 201)

        get_res = monitoring_module.lambda_handler({'httpMethod': 'GET'}, None)
        self.assertEqual(get_res['statusCode'], 200)

    def test_profile_saved_institutions(self):
        """GET and POST on /saved-institutions."""
        get_res = profile_module.lambda_handler({'httpMethod': 'GET', 'path': '/saved-institutions'}, None)
        self.assertEqual(get_res['statusCode'], 200)
        body = json.loads(get_res['body'])
        self.assertIn('savedIds', body)


if __name__ == '__main__':
    unittest.main()
