# BarberQ

POC for a barbershop booking platform — 100% serverless on AWS.

## Architecture

```
Browser → API Gateway → Lambda → Cognito
```

| Layer    | Service             | Notes                                              |
|----------|---------------------|----------------------------------------------------|
| Frontend | React (Vite)        | Part of root portfolio build, served at `/barberq` |
| Auth     | AWS Cognito         | Client pool deployed; business pool written (needs apply) |
| API      | AWS API Gateway     | REST API deployed to `dev` stage                   |
| Backend  | AWS Lambda (Python) | Client lambdas deployed; business lambdas written (needs apply) |
| IaC      | Terraform           | `infra/`, profile: kidnoti, region: eu-north-1     |

## Current Status

- [x] Cognito client user pool (`barberq-clients`) — deployed
- [x] Lambda `barberq-register-client` — deployed
- [x] Lambda `barberq-login-client` — deployed (HttpOnly cookie auth)
- [x] API Gateway — deployed, `/auth/register` and `/auth/login` wired (client)
- [x] Frontend wired to API via Vite proxy (`/api/*` → API Gateway)
- [x] AuthContext — accessToken stored in React memory
- [x] ProtectedRoute — redirects to login if not authenticated
- [x] Barbers page (`/barberq/barbers`) — protected, shows empty state
- [x] Cognito business pool (`barberq-business`) — written, needs `terraform apply`
- [x] Lambda `barberq-register-business` — written, needs `terraform apply`
- [x] Lambda `barberq-login-business` — written, needs `terraform apply`
- [x] Business register/login frontend — wired to `/api/auth/business/*`
- [x] BusinessDashboard page (`/barberq/dashboard/business`) — protected, placeholder sections
- [ ] API Gateway business resources — need manual creation after `terraform apply`

## Auth Flow

- **Client register:** POST `/api/auth/register` → Cognito SignUp → verify email
- **Client login:** POST `/api/auth/login` → Cognito → `refreshToken` set as HttpOnly cookie, `accessToken` returned in body
- **Business register:** POST `/api/auth/business/register` → Cognito SignUp (business pool) → verify email
- **Business login:** POST `/api/auth/business/login` → Cognito (business pool) → same cookie pattern, navigates to `/barberq/dashboard/business`
- **Protected routes:** `ProtectedRoute` checks `accessToken` in `AuthContext`, redirects to `/barberq/login/client` if absent
- **Refresh:** not implemented yet — accessToken is lost on page reload

## Project Structure

```
barberq/
  src/                  # React source (part of root Vite build)
    BarberQApp.tsx       # Router for /barberq/* routes, wrapped in AuthProvider
    context/
      AuthContext.tsx   # accessToken in memory, login/logout actions, useAuth hook
    components/
      ProtectedRoute.tsx  # Redirects to login if no accessToken
      LoginForm.tsx       # Handles both client (/api/auth/login) and business (/api/auth/business/login)
      RegisterForm.tsx    # Handles both client and business registration
      Navbar, Hero, Features, HowItWorks, Footer
    pages/
      Landing, ClientLogin, BusinessLogin, ClientRegister, BusinessRegister
      Barbers.tsx           # Protected — available barbers list (empty state)
      BusinessDashboard.tsx # Protected — Services + Availability placeholders
  lambdas/
    auth/
      register_client.py   # Client registration → Cognito SignUp
      login_client.py      # Client login → Cognito, returns HttpOnly cookie + accessToken
      register_business.py # Business registration → Cognito SignUp (business pool)
      login_business.py    # Business login → Cognito (business pool), same cookie pattern
  infra/                # Terraform
    main.tf             # Provider config
    cognito.tf          # Client + business Cognito pools and app clients
    lambda.tf           # IAM role + all four Lambda functions
    variables.tf        # allowed_origin variable
    terraform.tfvars    # Variable values (gitignored)
    outputs.tf          # Pool IDs, Lambda ARNs for all four lambdas
```

## User Pools

| Pool             | Status   | Purpose                        |
|------------------|----------|--------------------------------|
| barberq-clients  | Deployed | Customers booking appointments |
| barberq-business | Written  | Barbers offering services      |

## Routes

| Path                              | Page               | Protected |
|-----------------------------------|--------------------|-----------|
| `/barberq`                        | Landing page       | No        |
| `/barberq/login/client`           | Client login       | No        |
| `/barberq/login/business`         | Business login     | No        |
| `/barberq/register/client`        | Client register    | No        |
| `/barberq/register/business`      | Business register  | No        |
| `/barberq/barbers`                | Available barbers  | Yes       |
| `/barberq/dashboard/business`     | Business dashboard | Yes       |

## Next Steps

1. `terraform apply` in `barberq/infra/` to deploy business pool + lambdas
2. Add API Gateway resources manually:
   - Resource `/auth/business` → children `/register` and `/login`
   - POST methods → respective lambdas, enable CORS, redeploy to `dev`
3. Test end-to-end: register at `/barberq/register/business` → verify email → login → `/barberq/dashboard/business`

## Terraform

```bash
cd barberq/infra
/opt/homebrew/bin/terraform apply
```

## Frontend Dev

```bash
# from project root
npm run dev   # serves portfolio at :5173, barberq at :5173/barberq
              # /api/* proxied to API Gateway via Vite proxy
```

## Notes for Claude

- AWS profile: `kidnoti`, region: `eu-north-1`
- Terraform binary: `/opt/homebrew/bin/terraform` (arm64 — required on this machine)
- Vite proxy target: `https://y32snw82t3.execute-api.eu-north-1.amazonaws.com/dev`
- CloudFront URL: `https://d2qebwuuo4q2ld.cloudfront.net`
- State files (`terraform.tfstate`), `.terraform/`, `*.zip`, and `terraform.tfvars` must never be committed
- Prefer simple, direct solutions. Avoid over-engineering.
