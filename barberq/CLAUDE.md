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
| API      | AWS API Gateway     | REST API deployed to `dev` stage                   |
| Backend  | AWS Lambda (Python) | `register_client`, `login_client` — deployed       |
| IaC      | Terraform           | `infra/`, profile: kidnoti, region: eu-north-1     |

## Current Status

- [x] Cognito client user pool (`barberq-clients`) — deployed
- [x] Lambda `barberq-register-client` — deployed
- [x] Lambda `barberq-login-client` — deployed (HttpOnly cookie auth)
- [x] API Gateway — deployed, `/auth/register` and `/auth/login` wired
- [x] Frontend wired to API via Vite proxy (`/api/*` → API Gateway)
- [x] AuthContext — accessToken stored in React memory
- [x] ProtectedRoute — redirects to login if not authenticated
- [x] Barbers page (`/barberq/barbers`) — protected, shows empty state
- [ ] Business user pool + Lambda — not started

## Auth Flow

- **Register:** POST `/api/auth/register` → Cognito SignUp → verify email
- **Login:** POST `/api/auth/login` → Cognito → `refreshToken` set as HttpOnly cookie, `accessToken` returned in body and stored in React memory
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
      LoginForm.tsx       # Fetches /api/auth/login, credentials: include
      RegisterForm.tsx    # Fetches /api/auth/register, credentials: include
      Navbar, Hero, Features, HowItWorks, Footer
    pages/
      Landing, ClientLogin, BusinessLogin, ClientRegister, BusinessRegister
      Barbers.tsx         # Protected — available barbers list (empty state)
  lambdas/
    auth/
      register_client.py  # Client registration → Cognito SignUp
      login_client.py     # Client login → Cognito, returns HttpOnly cookie + accessToken
  infra/                # Terraform
    main.tf             # Provider config
    cognito.tf          # Cognito user pool + app client
    lambda.tf           # IAM role + Lambda functions
    variables.tf        # allowed_origin variable
    terraform.tfvars    # Variable values (gitignored)
    outputs.tf          # Pool IDs, Lambda ARNs
```

## User Pools

| Pool             | Status   | Purpose                        |
|------------------|----------|--------------------------------|
| barberq-clients  | Deployed | Customers booking appointments |
| barberq-business | Not yet  | Barbers offering services      |

## Routes

| Path                         | Page              | Protected |
|------------------------------|-------------------|-----------|
| `/barberq`                   | Landing page      | No        |
| `/barberq/login/client`      | Client login      | No        |
| `/barberq/login/business`    | Business login    | No        |
| `/barberq/register/client`   | Client register   | No        |
| `/barberq/register/business` | Business register | No        |
| `/barberq/barbers`           | Available barbers | Yes       |

## Next Steps

1. `terraform apply` in `barberq/infra/` to deploy `login_client` Lambda changes
2. Test end-to-end: register → verify email → login → check HttpOnly cookie in DevTools
3. Implement barbers list (API + Lambda)
4. Business user pool + Lambda

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
- Business flow is intentionally deferred — focus on client flow first
- Vite proxy target: `https://y32snw82t3.execute-api.eu-north-1.amazonaws.com/dev`
- CloudFront URL: `https://d2qebwuuo4q2ld.cloudfront.net`
- State files (`terraform.tfstate`), `.terraform/`, `*.zip`, and `terraform.tfvars` must never be committed
- Prefer simple, direct solutions. Avoid over-engineering.
