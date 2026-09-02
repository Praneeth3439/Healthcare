# HEALTHCARE Platform — Deployment Guide

This guide provides end-to-end instructions for deploying both the AWS Serverless Backend and the React Frontend using AWS SAM and standard cloud tooling.

---

## 1. Prerequisites

Ensure you have the following installed on your workstation:
- **Node.js**: v18.x or higher (`node -v`)
- **npm**: v9.x or higher (`npm -v`)
- **Python**: v3.10 or higher (`python --version`)
- **AWS CLI**: (`aws --version`) configured with appropriate IAM credentials (`aws configure`)
- **AWS SAM CLI**: (`sam --version`)

---

## 2. Local Development & Testing

### Step 2.1: Process the NIRF 2025 Dataset
```bash
# From repository root
python scripts/process_nirf_data.py
```

### Step 2.2: Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
The application will launch locally at `http://localhost:3000`.

### Step 2.3: Run Unit Tests
```bash
# From repository root
python -m unittest discover -s tests/unit
```

---

## 3. AWS Serverless Backend Deployment (AWS SAM)

### Step 3.1: Build Backend Artifacts
```bash
cd infrastructure
sam build
```

### Step 3.2: Deploy with SAM Guided Mode
```bash
sam deploy --guided
```
Prompt responses:
- **Stack Name**: `healthcare-platform-stack`
- **AWS Region**: `ap-south-1` (Mumbai) or your preferred region
- **Confirm changes before deploy**: `Y`
- **Allow SAM CLI IAM role creation**: `Y`
- **Disable rollback on failure**: `N`

### Step 3.3: Capture Outputs
Upon completion, note the generated CloudFormation Outputs:
- `ApiBaseUrl`: (e.g. `https://xyz123.execute-api.ap-south-1.amazonaws.com/prod`)
- `CognitoUserPoolId`: (e.g. `ap-south-1_xxxxxxxxx`)
- `CognitoClientId`: (e.g. `xxxxxxxxxxxxxxxxxxxxxxxxxx`)
- `FrontendBucketName`: (e.g. `healthcare-frontend-123456789012-ap-south-1`)
- `CloudFrontDistributionDomain`: (e.g. `d111111abcdef8.cloudfront.net`)

---

## 4. Frontend Production Build & CloudFront Deployment

### Step 4.1: Configure Environment Variables
Create or update `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com/prod
VITE_AWS_REGION=<region>
VITE_COGNITO_USER_POOL_ID=<user-pool-id>
VITE_COGNITO_CLIENT_ID=<client-id>
VITE_MAP_PROVIDER=openstreetmap
```

### Step 4.2: Build Static Bundle
```bash
cd frontend
npm run build
```

### Step 4.3: Sync to S3 & Invalidate CloudFront Cache
```bash
# Upload build output to S3
aws s3 sync dist/ s3://<FrontendBucketName> --delete

# Invalidate CloudFront CDN cache
aws cloudfront create-invalidation --distribution-id <DistributionId> --paths "/*"
```

---

## 5. Verification & Health Check

1. Visit your CloudFront distribution domain: `https://<CloudFrontDistributionDomain>`.
2. Verify all pages load cleanly over HTTPS.
3. Test searching and map interactions on `/find-healthcare`.
4. Test user registration and login on `/register` and `/login`.
5. Check CloudWatch Logs in the AWS Console for Lambda invocation logs and zero 5xx errors.

---

## 6. Teardown & Resource Cleanup

To remove all provisioned AWS cloud resources when testing is finished:
```bash
# Empty S3 bucket
aws s3 rm s3://<FrontendBucketName> --recursive

# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name healthcare-platform-stack
```
