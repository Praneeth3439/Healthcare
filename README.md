# HEALTHCARE — Digital Medical Discovery & Early Health-Risk Platform

[![NIRF 2025 Verified](https://img.shields.io/badge/NIRF%202025-50%20Medical%20Colleges-0F766E.svg)](https://www.nirfindia.org/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-0284C7.svg)](https://react.dev/)
[![Serverless](https://img.shields.io/badge/Backend-AWS%20Lambda%20%7C%20SAM-FF9900.svg)](https://aws.amazon.com/serverless/)
[![DynamoDB](https://img.shields.io/badge/Database-Amazon%20DynamoDB-4053D6.svg)](https://aws.amazon.com/dynamodb/)
[![License: Academic / Open](https://img.shields.io/badge/License-MIT%20%2F%20Academic-green.svg)](LICENSE)

> **"Better Healthcare. Smarter Decisions."**  
> An academic, research, and discovery platform combining official Ministry of Education NIRF 2025 medical institution rankings, interactive geospatial search, remote patient vital telemetry, and transparent early health-risk screening.

---

## 1. Executive Summary & Vision

**HEALTHCARE** is designed to solve healthcare information asymmetry. It bridges authentic accredited medical university rankings with interactive geospatial mapping, longitudinal vital sign telemetry, and evidence-based early health risk awareness.

### Core Pillars
1. **NIRF 2025 Medical Colleges Discovery**: 50 verified premier medical colleges in India with 100% geographic coordinates, rank benchmarks, and location details.
2. **Interactive Geospatial Mapping**: React-Leaflet visual mapping with Haversine distance computations from the user's location.
3. **Remote Patient Monitoring Prototype**: Telemetry logger tracking Heart Rate, Blood Pressure, Blood Glucose, SpO2, Temperature, and Weight over time with Recharts visualization.
4. **Responsible Early Health-Risk Screening**: Deterministic rule-based assessment evaluating cardiovascular, metabolic, and symptom risk factors with actionable guidance.
5. **UN Sustainable Development Goals**: Direct alignment with **SDG 3 (Good Health & Well-Being)** and **SDG 4 (Quality Education)**.

---

## 2. Important Medical & Dataset Disclaimer

> [!IMPORTANT]
> **Non-Diagnostic Medical Notice**:  
> *"This screening provides an informational risk assessment and does not constitute a medical diagnosis. Consult a qualified healthcare professional for diagnosis and treatment."*
> 
> Remote patient monitoring is an educational prototype unless paired with approved, certified medical device integrations.

> [!NOTE]
> **Zero Fabrication Policy**:  
> All 50 medical institutions, ranks, and coordinates are derived directly from the official `data/raw/NIRF RANKING of 2025 Medical colleges.csv` dataset. Doctor-level information is explicitly flagged as not present in the NIRF dataset.

---

## 3. System Architecture

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

## 4. Key Platform Features

### 🔍 4.1 Medical Institutions Discovery (`/find-healthcare`)
- Search by keyword, college name, city, state, or postal address.
- Filter by State (18 states/UTs), City (32 unique cities), NIRF rank bracket, or max distance radius.
- Sort by highest NIRF rank, nearest to user, year founded, or alphabetical.
- Synchronized Leaflet map with custom SVG rank pins and auto-focus zoom on selection.

### 📍 4.2 Institution Profile (`/institution/:id`)
- Official NIRF 2025 rank, foundation year, full address, and exact coordinates.
- Geodesic distance calculation from the user's GPS coordinates.
- Focused interactive location map with Google Maps directions link.
- Bookmark / Save institution to user dashboard.

### 💓 4.3 Remote Patient Monitoring Prototype (`/remote-monitoring`)
- Log observational readings: Heart Rate (bpm), Blood Pressure (mmHg), Fasting/Random Glucose (mg/dL), SpO2 (%), Temperature (°F), and Weight (kg).
- Real-time physiological range evaluation (Normal, Elevated, Alert).
- Interactive Recharts longitudinal line charts with shaded reference bands.
- Historical observation table with CSV export.

### 📋 4.4 Early Health-Risk Screening (`/health-screening`)
- Multi-step questionnaire covering Demographics, Vitals, Symptoms, and Family History.
- Transparent, deterministic clinical risk score (0–100) and risk category (**Low Risk**, **Moderate Risk**, **Higher Risk**).
- Factor-by-factor risk attribution with severity ratings.
- Linkage to top NIRF medical institutions for follow-up care.

### 🌍 4.5 UN Sustainable Development Goals (`/sdg-3` & `/sdg-4`)
- **SDG 3**: Universal Health Coverage (Target 3.8), telemedicine accessibility, and preventive awareness.
- **SDG 4**: Quality medical education, health literacy, and institutional academic accreditation standards.

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend UI** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Mapping & Geospatial** | React-Leaflet, Leaflet, OpenStreetMap, Haversine Algorithm |
| **Data Visualization** | Recharts (Responsive Line & Area SVG Charts) |
| **Serverless Compute** | AWS Lambda (Python 3.10 Runtime) |
| **API Management** | Amazon API Gateway (HTTP API with CORS) |
| **Database** | Amazon DynamoDB (On-Demand Pay-per-Request NoSQL) |
| **Authentication** | Amazon Cognito User Pools & App Client |
| **CDN & Storage** | Amazon CloudFront & Amazon S3 |
| **Infrastructure as Code**| AWS Serverless Application Model (AWS SAM) |
| **Monitoring** | Amazon CloudWatch Logs, Metrics, & Alarms |

---

## 6. Local Quickstart & Development

### 1. Clone & Inspect Repository
```bash
git clone <repository-url>
cd Healthcare
```

### 2. Process the NIRF 2025 Dataset
```bash
python scripts/process_nirf_data.py
```
*Outputs: `data/processed/nirf_medical_2025_processed.json` & `frontend/src/data/nirf_data.json`.*

### 3. Run the Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 4. Build for Production
```bash
npm run build
```

---

## 7. Automated Testing Suite

Execute the full suite of unit tests verifying dataset integrity, geospatial algorithms, and Lambda handlers:

```bash
# From repository root
python -m unittest discover -s tests/unit
```

### Test Coverage
- `tests/unit/test_nirf_processing.py`: Validates all 50 colleges, ranks 1–50 continuity, and coordinate bounding boxes.
- `tests/unit/test_geospatial.py`: Validates Haversine distance accuracy against known benchmark city distances.
- `tests/unit/test_risk_screening.py`: Validates rule-based screening risk scoring and mandatory disclaimers.
- `tests/unit/test_api_functions.py`: Validates all Lambda API proxy events and responses.
- `tests/performance/load_test.py`: Concurrency and latency evaluation framework.

---

## 8. AWS Cloud Deployment (AWS SAM)

Follow these steps to deploy the complete serverless cloud infrastructure:

```bash
# 1. Build serverless backend
cd infrastructure
sam build

# 2. Deploy to AWS
sam deploy --guided

# 3. Build frontend bundle
cd ../frontend
npm run build

# 4. Sync assets to provisioned S3 bucket
aws s3 sync dist/ s3://<FrontendBucketName> --delete

# 5. Invalidate CloudFront CDN cache
aws cloudfront create-invalidation --distribution-id <DistributionId> --paths "/*"
```
*See [`docs/deployment.md`](docs/deployment.md) for full detailed steps.*

---

## 9. Documentation Index

- [`docs/architecture.md`](docs/architecture.md) — Comprehensive Serverless Architecture & Component Flow
- [`docs/dataset.md`](docs/dataset.md) — NIRF 2025 Dataset Schema, Provenance & Cleaning Audit
- [`docs/deployment.md`](docs/deployment.md) — Step-by-Step AWS SAM & CloudFront Deployment Guide
- [`docs/security.md`](docs/security.md) — Cognito Authentication, IAM Least Privilege & Data Privacy
- [`docs/performance.md`](docs/performance.md) — Latency Percentiles (P50/P95/P99) & Cold Start Methodology
- [`docs/cost.md`](docs/cost.md) — AWS Free Tier & Low-Cost Serverless Breakdown ($0.00/mo)

---

## 10. License & Attribution

- **Dataset**: Ministry of Education, Government of India (NIRF 2025 Ranking Category: Medical).
- **Map Data**: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- **License**: MIT License — Free for academic, educational, and research use.
