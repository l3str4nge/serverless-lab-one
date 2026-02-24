# BarberQ

POC for a barbershop booking platform — 100% serverless on AWS.

## Architecture

```
Browser → API Gateway → Lambda → Cognito
```

| Layer    | Service             | Notes                                              |
|----------|---------------------|----------------------------------------------------|
| Frontend | React (Vite)        | Part of root portfolio build, served at `/barberq` |
| Auth     | AWS Cognito         | Client user pool deployed (`barberq-clients`)      |
| API      | AWS API Gateway     | To be created manually in AWS console              |
| Backend  | AWS Lambda (Python) | `barberq-register-client` — needs terraform apply  |
| IaC      | Terraform           | `infra/`, profile: kidnoti, region: eu-north-1     |

## Current Status

- [x] Cognito client user pool (`barberq-clients`) — deployed
- [x] Lambda `barberq-register-client` — written, needs `terraform apply`
- [ ] API Gateway — user creates manually after Lambda is deployed
- [ ] Frontend wired to real API
- [ ] Business user pool + Lambda — not started

## Project Structure

```
barberq/
  src/                  # React source (part of root Vite build)
    BarberQApp.tsx       # Router for /barberq/* routes
    components/         # Navbar, Hero, Features, HowItWorks, Footer, LoginForm, RegisterForm
    pages/              # Landing, ClientLogin, BusinessLogin, ClientRegister, BusinessRegister
  lambdas/
    auth/
      register_client.py  # Client registration → Cognito
  infra/                # Terraform
    main.tf             # Provider config
    cognito.tf          # Cognito user pool + app client
    lambda.tf           # IAM role + register_client Lambda
    outputs.tf          # Pool IDs, Lambda ARNs
```

## User Pools

| Pool            | Status   | Purpose                        |
|-----------------|----------|--------------------------------|
| barberq-clients | Deployed | Customers booking appointments |
| barberq-business| Not yet  | Barbers offering services      |

## Routes

| Path                        | Page              |
|-----------------------------|-------------------|
| `/barberq`                  | Landing page      |
| `/barberq/login/client`     | Client login      |
| `/barberq/login/business`   | Business login    |
| `/barberq/register/client`  | Client register   |
| `/barberq/register/business`| Business register |

## Next Steps

1. `terraform apply` in `barberq/infra/` to deploy Lambda
2. Create API Gateway manually: REST API → `/auth/register` → POST → `barberq-register-client` → deploy to `dev` stage
3. Wire Invoke URL into `RegisterForm.tsx` (replace placeholder `// TODO`)
4. Test end-to-end client registration

## Terraform

```bash
cd barberq/infra
/opt/homebrew/bin/terraform apply
```

## Frontend Dev

```bash
# from project root
npm run dev   # serves portfolio at :5173, barberq at :5173/barberq
```

## Notes for Claude

- AWS profile: `kidnoti`, region: `eu-north-1`
- Terraform binary: `/opt/homebrew/bin/terraform` (arm64 — required on this machine)
- Business flow is intentionally deferred — focus on client flow first
- API Gateway URL goes into `RegisterForm.tsx` to replace the placeholder
- State files (`terraform.tfstate`), `.terraform/`, and `*.zip` must never be committed
- Prefer simple, direct solutions. Avoid over-engineering.
