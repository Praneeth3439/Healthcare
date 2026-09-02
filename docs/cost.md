# HEALTHCARE Platform — Cost & Financial Analysis

## 1. Architectural Cost Overview

HEALTHCARE is engineered strictly on AWS Serverless principles (Pay-As-You-Go). There are no always-on EC2 instances, provisioned databases, or idle hourly cluster charges.

---

## 2. Monthly AWS Free-Tier & Paid Usage Breakdown

| Service | Free-Tier Allowance (Monthly) | Estimated Monthly Academic Load | Estimated Cost (Within Free Tier) |
|---|---|---|---|
| **AWS Lambda** | 1,000,000 requests + 3.2M seconds compute | ~50,000 requests (256MB) | **$0.00** |
| **Amazon API Gateway** | 1,000,000 HTTP API calls (First 12 months) | ~50,000 calls | **$0.00** ($0.05/mo after) |
| **Amazon DynamoDB** | 25 GB storage + 25 RCU / WCU free | < 100 MB data (On-demand) | **$0.00** |
| **Amazon S3** | 5 GB standard storage | ~15 MB frontend bundle | **$0.00** |
| **Amazon CloudFront** | 1 TB data transfer out + 10M requests | ~2 GB transfer | **$0.00** |
| **Amazon Cognito** | 50,000 Monthly Active Users (MAUs) | ~200 MAUs | **$0.00** |
| **Amazon CloudWatch** | 5 GB log ingestion + basic metrics | < 500 MB logs | **$0.00** |
| **Map Tiles (OSM)** | OpenStreetMap tile server | Unlimited non-commercial | **$0.00** |
| **Total Estimated Cost** | — | — | **$0.00 / month** |

---

## 3. Post-Free Tier / Production Scaled Costs

If the application exceeds the standard AWS 12-month free tier or scales to 100,000+ monthly visits:
- **API Gateway (HTTP API)**: $1.00 per 1,000,000 requests
- **AWS Lambda (256MB, 50ms average)**: ~$0.00000021 per invocation (~$0.21 per million invocations)
- **DynamoDB (On-Demand)**: $1.25 per million write units, $0.25 per million read units
- **CloudFront Data Out**: $0.085 per GB

*Estimated monthly cost at 100,000 active visits: Approximately $1.50 – $3.00 USD / month.*

---

## 4. Cost Governance & Guardrails

1. **Billing Alarms**: Configure Amazon CloudWatch Billing Alarm to notify administrators if charges exceed $5.00/month.
2. **Payload Minimization**: Gzip compression and client-side caching on static assets minimize CloudFront egress bandwidth.
3. **No Provisioned Concurrency**: On-demand Lambda scaling prevents idle compute billing.
