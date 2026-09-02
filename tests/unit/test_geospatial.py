#!/usr/bin/env python3
"""
Unit Tests for Geospatial Distance Calculations and Coordinate Handlers
"""

import unittest
import math


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0  # Earth's radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 1)


class TestGeospatialCalculations(unittest.TestCase):
    def test_same_point_zero_distance(self):
        """Distance between identical coordinates must be 0.0 km."""
        dist = haversine_distance(28.565, 77.210, 28.565, 77.210)
        self.assertEqual(dist, 0.0)

    def test_delhi_to_chandigarh_benchmark(self):
        """AIIMS Delhi (28.565, 77.210) to PGIMER Chandigarh (30.760, 76.780) is ~247 km."""
        dist = haversine_distance(28.565, 77.210, 30.760, 76.780)
        self.assertTrue(240.0 <= dist <= 260.0, f"Distance {dist} km outside expected benchmark 240-260 km")

    def test_delhi_to_vellore_benchmark(self):
        """AIIMS Delhi to CMC Vellore (12.925, 79.136) is ~1750 km."""
        dist = haversine_distance(28.565, 77.210, 12.925, 79.136)
        self.assertTrue(1700.0 <= dist <= 1800.0, f"Distance {dist} km outside expected benchmark 1700-1800 km")

    def test_negative_symmetry(self):
        """Distance from A to B must equal distance from B to A."""
        d1 = haversine_distance(12.937, 77.592, 22.539, 88.341)
        d2 = haversine_distance(22.539, 88.341, 12.937, 77.592)
        self.assertEqual(d1, d2)


if __name__ == '__main__':
    unittest.main()
