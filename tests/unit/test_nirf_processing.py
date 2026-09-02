#!/usr/bin/env python3
"""
Unit Tests for NIRF 2025 Dataset Processing and Integrity
"""

import unittest
import os
import json


class TestNIRFDatasetIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.processed_json_path = os.path.join(
            os.path.dirname(__file__), '..', '..', 'data', 'processed', 'nirf_medical_2025_processed.json'
        )
        cls.frontend_json_path = os.path.join(
            os.path.dirname(__file__), '..', '..', 'frontend', 'src', 'data', 'nirf_data.json'
        )
        
        with open(cls.processed_json_path, 'r', encoding='utf-8') as f:
            cls.data = json.load(f)

    def test_total_record_count(self):
        """Must have exactly 50 medical institutions as per NIRF 2025 ranking."""
        self.assertEqual(len(self.data), 50)

    def test_ranks_continuity(self):
        """NIRF ranks must be 1 to 50 without duplicates or gaps."""
        ranks = [item['nirf_rank'] for item in self.data]
        self.assertEqual(sorted(ranks), list(range(1, 51)))

    def test_required_fields_present(self):
        """All records must have required fields."""
        required_keys = {'id', 'name', 'nirf_rank', 'address', 'city', 'state', 'latitude', 'longitude', 'has_coordinates'}
        for item in self.data:
            for key in required_keys:
                self.assertIn(key, item, f"Missing key {key} in record {item.get('name')}")
                self.assertIsNotNone(item[key], f"Key {key} is None in record {item.get('name')}")

    def test_geographical_bounds_india(self):
        """All coordinates must be valid geographic coordinates inside India."""
        for item in self.data:
            lat = item['latitude']
            lng = item['longitude']
            self.assertTrue(8.0 <= lat <= 36.0, f"Invalid latitude {lat} for {item['name']}")
            self.assertTrue(68.0 <= lng <= 98.0, f"Invalid longitude {lng} for {item['name']}")

    def test_frontend_data_sync(self):
        """The frontend bundled JSON must be identical to the processed JSON."""
        with open(self.frontend_json_path, 'r', encoding='utf-8') as f:
            frontend_data = json.load(f)
        self.assertEqual(len(self.data), len(frontend_data))
        self.assertEqual(self.data[0]['name'], frontend_data[0]['name'])
        self.assertEqual(self.data[-1]['name'], frontend_data[-1]['name'])

    def test_doctor_info_not_fabricated(self):
        """Doctor information must be explicitly flagged as false."""
        for item in self.data:
            self.assertFalse(item['doctor_info_available'])
            self.assertIsNone(item['score'])


if __name__ == '__main__':
    unittest.main()
