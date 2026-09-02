# HEALTHCARE Platform — Performance & Benchmark Methodology

## 1. Performance Overview

The HEALTHCARE architecture is optimized for sub-100ms response times for medical institution queries, instantaneous client-side geospatial filtering, and minimal Lambda cold-start overhead.

---

## 2. Benchmark Metrics & Measurement Methodology

When testing performance against a deployed AWS environment, the following metrics are evaluated:

| Metric | Target | Measurement Method |
|---|---|---|
| **Client First Contentful Paint (FCP)** | < 0.8s | Lighthouse / Core Web Vitals |
| **Client Largest Contentful Paint (LCP)** | < 1.5s | CloudFront Edge Caching |
| **Lambda Warm Execution Latency** | < 25ms | CloudWatch Duration Metric |
| **Lambda Cold Start Latency** | < 350ms | CloudWatch InitDuration Metric |
| **API Gateway P50 Latency** | < 45ms | Load testing suite (`tests/performance/load_test.py`) |
| **API Gateway P95 Latency** | < 120ms | Load testing suite under 50 concurrent users |
| **API Gateway P99 Latency** | < 250ms | Load testing suite under 100 concurrent users |

---

## 3. Cold Start Optimization Strategy

Python 3.10 Lambda functions are configured to minimize initialization overhead:
1. **Lightweight Runtime**: Zero bulky heavy dependencies in the critical path (using Python standard `math`, `json`, `re` for institutions handler).
2. **Pre-warmed Bundled JSON**: `nirf_data.json` is loaded at top-level module scope during the Lambda initialization phase, avoiding per-request disk reads.
3. **Memory Sizing**: Provisioned at 256MB to balance CPU allocation and cost.

---

## 4. Live Cloud Measurement Status

> [!NOTE]
> **Status**: *Not measured against live cloud infrastructure yet — requires deployed AWS environment.*
> 
> To execute live benchmarks after deploying to AWS via SAM, run:
> ```bash
> $env:HEALTHCARE_API_URL = "https://<your-api-id>.execute-api.ap-south-1.amazonaws.com/prod"
> python tests/performance/load_test.py
> ```
