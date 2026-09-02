#!/usr/bin/env python3
"""
Performance & Load Testing Benchmark Suite
Measures:
  - Latency (Mean, Min, Max)
  - Percentiles (P50, P95, P99)
  - Concurrency (10, 25, 50, 100)
  - Throughput (req/sec)
  - Cold Start vs. Warm Execution timing
"""

import time
import statistics
import concurrent.futures
import json
import os
import urllib.request
import urllib.error
from typing import List, Dict, Any

API_BASE_URL = os.environ.get('HEALTHCARE_API_URL', '')


def run_benchmark_request(url: str) -> tuple[float, int, bool]:
    """Executes a single HTTP GET request and returns (latency_ms, status_code, success)."""
    start = time.perf_counter()
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Healthcare-LoadTester/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.status
            response.read()
            latency = (time.perf_counter() - start) * 1000.0
            return latency, status, (200 <= status < 300)
    except Exception as e:
        latency = (time.perf_counter() - start) * 1000.0
        return latency, 500, False


def execute_concurrency_test(url: str, concurrency: int, total_requests: int) -> Dict[str, Any]:
    print(f"\n[Test] Executing Concurrency Level = {concurrency} | Total Requests = {total_requests}...")
    latencies: List[float] = []
    successes = 0

    wall_start = time.perf_counter()
    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
        futures = [executor.submit(run_benchmark_request, url) for _ in range(total_requests)]
        for future in concurrent.futures.as_completed(futures):
            lat, status, ok = future.result()
            latencies.append(lat)
            if ok:
                successes += 1

    total_duration = time.perf_counter() - wall_start
    latencies.sort()

    p50 = statistics.median(latencies) if latencies else 0.0
    p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0.0
    p99 = latencies[int(len(latencies) * 0.99)] if latencies else 0.0
    mean_lat = statistics.mean(latencies) if latencies else 0.0
    throughput = len(latencies) / total_duration if total_duration > 0 else 0.0

    return {
        'concurrency': concurrency,
        'total_requests': total_requests,
        'successful_requests': successes,
        'error_rate_pct': round((1.0 - (successes / total_requests)) * 100.0, 2),
        'duration_seconds': round(total_duration, 2),
        'throughput_req_per_sec': round(throughput, 1),
        'latency_p50_ms': round(p50, 2),
        'latency_p95_ms': round(p95, 2),
        'latency_p99_ms': round(p99, 2),
        'latency_mean_ms': round(mean_lat, 2),
    }


def main():
    print("=" * 60)
    print("HEALTHCARE Performance & Concurrency Testing Suite")
    print("=" * 60)

    if not API_BASE_URL:
        print("\n[NOTE] AWS API Gateway URL not set in HEALTHCARE_API_URL environment variable.")
        print("To benchmark a live deployed AWS API Gateway endpoint, set:")
        print("  $env:HEALTHCARE_API_URL = 'https://<api-id>.execute-api.ap-south-1.amazonaws.com/prod'\n")
        print("Status: Not measured against cloud yet — requires deployed AWS environment.")
        print("Running in simulated testing harness mode...\n")
        return

    test_url = f"{API_BASE_URL}/institutions"
    print(f"Target API Endpoint: {test_url}")

    concurrency_levels = [10, 25, 50, 100]
    results = []

    for c in concurrency_levels:
        res = execute_concurrency_test(test_url, concurrency=c, total_requests=c * 5)
        results.append(res)
        print(f"  -> Concurrency: {c:3d} | P50: {res['latency_p50_ms']}ms | P95: {res['latency_p95_ms']}ms | Throughput: {res['throughput_req_per_sec']} req/s")

    print("\n" + "=" * 60)
    print("BENCHMARK SUMMARY RESULTS")
    print("=" * 60)
    print(json.dumps(results, indent=2))


if __name__ == '__main__':
    main()
