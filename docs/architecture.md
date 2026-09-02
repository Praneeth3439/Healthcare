# HEALTHCARE Platform — System Architecture

## 1. High-Level System Architecture

HEALTHCARE is engineered as a cloud-native, 100% serverless, event-driven web application designed for high availability, zero idle server cost, and millisecond geospatial query execution.

```
[ User Browser / Mobile Client ]
              │
              ▼ (HTTPS / TLS 1.3)
      [ Amazon CloudFront CDN ]
              │
     ┌────────┴────────────────────────┐
     ▼                                 ▼
[ Amazon S3 ]               [ Amazon API Gateway ]
(React SPA Assets)          (HTTP API / CORS)
                                       │
                     ┌─────────────────┼─────────────────┐
                     ▼                 ▼                 ▼
             [ Lambda: Inst ]   [ Lambda: Screen ] [ Lambda: Monitor ]
             (Geospatial + NIRF)(Rule-Based Risk)  (Vitals Telemetry)
                     │                 │                 │
                     └─────────────────┼─────────────────┘
                                       ▼
                             [ Amazon DynamoDB ]
                             (Pay-per-request NoSQL)
                                       │
                            [ Amazon CloudWatch ]
                            (Logs, Alarms, Metrics)
```

---

## 2. Component Breakdown

### 2.1 Frontend Client (React 18 + TypeScript + Vite + Tailwind)
- **Static Delivery**: Hosted on Amazon S3 bucket with CloudFront Origin Access Control (OAC).
- **Client-Side Rendering**: Single-Page Application (SPA) powered by React Router with sub-second client navigation.
- **Geospatial Mapping**: React-Leaflet integration utilizing OpenStreetMap tiles and custom HTML5 rank-badged SVG pin markers.
- **Visual Telemetry**: Interactive Recharts responsive vector charts for longitudinal patient vital signs.
- **Offline & Standalone Fallback**: Bundled verified NIRF 2025 JSON dataset enabling instantaneous client search even without active backend connectivity.

### 2.2 API Gateway & Serverless Compute (Python 3.10)
- **Amazon API Gateway (HTTP API)**: Routes incoming REST requests, enforces CORS policies, and proxies events to AWS Lambda functions.
- **Lambda Functions**:
  - `InstitutionsFunction`: Handles search, filter by state/city/rank, and computes geodesic distances via the Haversine spherical formula.
  - `ScreeningFunction`: Executes deterministic rule-based cardiovascular and metabolic risk calculations with contributing factor attribution.
  - `MonitoringFunction`: Ingests and retrieves physiological vital observations.
  - `ProfileFunction`: Manages user profile updates and bookmarked NIRF medical institutions.

### 2.3 Persistence & Security (Amazon DynamoDB & Amazon Cognito)
- **Amazon DynamoDB**: Serverless, pay-per-request NoSQL storage structured for single-digit millisecond latency across 4 core entities (`healthcare-users`, `healthcare-observations`, `healthcare-screening-results`, `healthcare-saved-institutions`).
- **Amazon Cognito User Pools**: Manages user registration, email verification, login flows, and issues signed JSON Web Tokens (JWT).

---

## 3. Serverless Architectural Advantages

1. **Zero Idle Cost**: No servers or EC2 instances running when traffic is idle. Costs scale strictly with active invocations.
2. **Instant Auto-Scaling**: Handles traffic spikes effortlessly from 1 to thousands of concurrent users.
3. **Data Isolation**: Partition keys ensure complete tenant isolation for patient health observations.
4. **Resilience**: Managed multi-AZ replication built directly into S3, DynamoDB, and Lambda.
