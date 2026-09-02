# HEALTHCARE Platform — Security & Governance Architecture

## 1. Security Overview

HEALTHCARE is designed with a defense-in-depth security posture, applying principle of least privilege, strict transport encryption, input sanitization, and data minimization across all layers.

---

## 2. Authentication & Authorization (Amazon Cognito)

- **Amazon Cognito User Pools**: User identities are securely managed using AWS Cognito with SRP (Secure Remote Password) protocol support.
- **No Plaintext Passwords**: Password hashes are never stored in databases or logged to CloudWatch.
- **Strong Password Policy**: Enforces minimum 8 characters with required uppercase, lowercase, and numeric digits.
- **JWT Session Tokens**: Authenticated requests carry short-lived JSON Web Tokens verified at the API Gateway or Lambda layer.

---

## 3. Network & Transport Security

- **Enforced HTTPS**: CloudFront redirects all HTTP traffic to HTTPS via TLS 1.3/1.2.
- **CORS Policies**: Explicit HTTP headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Methods`) prevent unauthorized cross-origin access.
- **Origin Access Control (OAC)**: S3 bucket hosting frontend assets is strictly private; only CloudFront is granted read permissions via SigV4 signed requests.

---

## 4. Compute & Database IAM Least Privilege

- **Granular IAM Roles**: Each Lambda function is assigned a dedicated IAM execution role restricted strictly to its target DynamoDB table (`DynamoDBCrudPolicy`).
- **No Hardcoded Credentials**: No AWS access keys, secret keys, or passwords exist in the source code.
- **Environment Isolation**: Tables and variables are parameterized via AWS SAM CloudFormation references.

---

## 5. Patient Data Minimization & Prototype Compliance

- **No Unnecessary PHI Logging**: Health observations are stripped of unnecessary personal identifiers before storage.
- **No Commercial Data Sharing**: Telemetry and screening answers are never transmitted to third-party analytics trackers.
- **Clear Non-Diagnostic Notices**: Prominent disclaimers prevent misleading users into viewing educational tools as formal clinical diagnoses.
