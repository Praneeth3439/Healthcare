#!/usr/bin/env python3
"""
Unit Tests for Rule-Based Health Risk Assessment Engine
"""

import unittest
import os
import importlib.util

screening_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'functions', 'screening', 'app.py')
spec = importlib.util.spec_from_file_location("screening_module", screening_path)
screening_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(screening_module)

calculate_bmi = screening_module.calculate_bmi
evaluate_screening = screening_module.evaluate_screening


class TestHealthRiskEngine(unittest.TestCase):
    def test_bmi_categories(self):
        """BMI calculation and categorization validation."""
        bmi, cat = calculate_bmi(180, 70)  # ~21.6
        self.assertEqual(cat, 'Normal weight')
        self.assertAlmostEqual(bmi, 21.6, places=1)

        bmi_obese, cat_obese = calculate_bmi(160, 95)  # ~37.1
        self.assertEqual(cat_obese, 'Obese')
        self.assertTrue(bmi_obese >= 30)

        bmi_overweight, cat_ow = calculate_bmi(170, 78)  # ~27.0
        self.assertEqual(cat_ow, 'Overweight')

    def test_healthy_young_profile_low_risk(self):
        """A 25-year old, active non-smoker with normal BMI and no symptoms must be Low Risk."""
        input_data = {
            'age': 25,
            'heightCm': 175,
            'weightKg': 68,
            'activityLevel': 'active',
            'smokingStatus': 'never',
            'hasHypertensionHistory': False,
            'hasDiabetesHistory': False,
            'hasFamilyHeartDisease': False,
            'symptoms': []
        }
        res = evaluate_screening(input_data)
        self.assertEqual(res['overallRisk'], 'Low Risk')
        self.assertTrue(res['riskScore'] < 30)
        self.assertIn('informational risk assessment', res['disclaimer'].lower())

    def test_high_risk_profile(self):
        """An individual with smoking, hypertension, diabetes, and multiple symptoms must trigger Higher Risk."""
        input_data = {
            'age': 65,
            'heightCm': 165,
            'weightKg': 92,  # Obese
            'activityLevel': 'sedentary',
            'smokingStatus': 'current',
            'hasHypertensionHistory': True,
            'hasDiabetesHistory': True,
            'hasFamilyHeartDisease': True,
            'symptoms': ['Chest tightness or discomfort', 'Shortness of breath on mild exertion']
        }
        res = evaluate_screening(input_data)
        self.assertEqual(res['overallRisk'], 'Higher Risk')
        self.assertTrue(res['riskScore'] >= 60)
        self.assertTrue(len(res['contributingFactors']) >= 5)

    def test_mandatory_disclaimer_present(self):
        """All evaluation outcomes must strictly contain the non-diagnostic disclaimer."""
        res = evaluate_screening({'age': 40, 'heightCm': 170, 'weightKg': 70})
        self.assertIn('disclaimer', res)
        self.assertEqual(
            res['disclaimer'],
            'This screening provides an informational risk assessment and does not constitute a medical diagnosis. Consult a qualified healthcare professional for diagnosis and treatment.'
        )


if __name__ == '__main__':
    unittest.main()
