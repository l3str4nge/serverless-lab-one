# BarberQ

POC for a barbershop booking platform — 100% serverless on AWS.

## Architecture

```
Browser → CloudFront → S3 (React SPA)
Browser → API Gateway → Lambda → Cognito
```

| Layer    | Service             | Notes                                       |
|----------|---------------------|---------------------------------------------|
| Frontend | React (Vite)        | Landing page + client/business registration |
| Auth     | AWS Cognito         | Separate user pools for clients and barbers |
| API      | AWS API Gateway     | REST API, routes to Lambda                  |
| Backend  | AWS Lambda (Python) | Handles auth logic, talks to Cognito        |
| IaC      | Terraform           | `infra/`, profile: kidnoti, region: eu-north-1 |

## Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS v4
- **Backend:** Python, AWS Lambda
- **Auth:** AWS Cognito
- **IaC:** Terraform

## Project Structure

```
barberq/
  frontend/           # React app
    src/
      components/     # Navbar, Hero, Features, HowItWorks, Footer
  infra/              # Terraform — Cognito, API Gateway, Lambda
```

## User Pools

| Pool               | Purpose                         |
|--------------------|---------------------------------|
| barberq-clients    | Customers booking appointments  |
| barberq-businesses | Barbers offering services       |

## Common Commands

```bash
cd barberq/frontend
npm run dev      # Local dev server
npm run build    # Production build
```

## Terraform

```bash
cd barberq/infra
/opt/homebrew/bin/terraform init
/opt/homebrew/bin/terraform plan
/opt/homebrew/bin/terraform apply
```

## Notes for Claude

- AWS profile: `kidnoti`, region: `eu-north-1`
- Terraform binary: `/opt/homebrew/bin/terraform` (arm64 — required on this machine)
- Do not add AWS services beyond what is listed in the Architecture table above.
- When adding a new AWS service, update the Architecture table.
- State files (`terraform.tfstate`) and `.terraform/` directories must never be committed.
- Prefer simple, direct solutions. Avoid over-engineering.
