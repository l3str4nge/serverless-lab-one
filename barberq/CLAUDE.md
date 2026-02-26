# BarberQ

POC for a barbershop booking platform — 100% serverless on AWS.

## Architecture

```
Browser → API Gateway → Lambda → Cognito / DynamoDB
```

| Layer    | Service             | Notes                                              |
|----------|---------------------|----------------------------------------------------|
| Frontend | React (Vite)        | Part of root portfolio build, served at `/barberq` |
| Auth     | AWS Cognito         | Client pool + business pool — both deployed        |
| API      | AWS API Gateway     | REST API deployed to `dev` stage                   |
| Backend  | AWS Lambda (Python) | Auth + services lambdas — all deployed             |
| Database | AWS DynamoDB        | `barberq-services` table — deployed                |
| IaC      | Terraform           | `infra/`, profile: kidnoti, region: eu-north-1     |

## Current Status

- [x] Cognito client user pool (`barberq-clients`) — deployed
- [x] Cognito business user pool (`barberq-business`) — deployed
- [x] Lambda `barberq-register-client` — deployed
- [x] Lambda `barberq-login-client` — deployed (HttpOnly cookie auth)
- [x] Lambda `barberq-register-business` — deployed
- [x] Lambda `barberq-login-business` — deployed
- [x] Lambda `barberq-add-service` — deployed
- [x] Lambda `barberq-list-services` — deployed
- [x] DynamoDB `barberq-services` — deployed
- [x] API Gateway — `/auth/register`, `/auth/login`, `/auth/business/register`, `/auth/business/login`, `/services` (POST + GET) — all wired
- [x] Frontend wired to API via Vite proxy (`/api/*` → API Gateway)
- [x] AuthContext — accessToken stored in React memory
- [x] ProtectedRoute — redirects to login if not authenticated
- [x] BusinessDashboard — lists services, "Add service" button
- [x] AddService page — form wired to POST /api/services
- [ ] Token refresh — accessToken lost on page reload (refreshToken cookie exists, no refresh Lambda yet)
- [ ] Availability section — placeholder only

## Auth Flow

- **Client register:** POST `/api/auth/register` → Cognito SignUp → verify email
- **Client login:** POST `/api/auth/login` → Cognito → `refreshToken` HttpOnly cookie + `accessToken` in body
- **Business register:** POST `/api/auth/business/register` → Cognito SignUp (business pool) → verify email
- **Business login:** POST `/api/auth/business/login` → Cognito (business pool) → same cookie pattern, navigates to `/barberq/dashboard/business`
- **Protected routes:** `ProtectedRoute` checks `accessToken` in `AuthContext`, redirects to `/barberq/login/client` if absent
- **Refresh:** not implemented — accessToken lost on page reload

## Services Flow

- **Add service:** POST `/api/services` — Bearer token in Authorization header, writes `{ businessId, serviceId, name, price, durationMinutes }` to DynamoDB
- **List services:** GET `/api/services` — Bearer token, queries DynamoDB by `businessId` (JWT `sub`)
- Both lambdas decode `sub` directly from the JWT (no Cognito API call)

## Project Structure

```
barberq/
  src/                  # React source (part of root Vite build)
    BarberQApp.tsx       # Router for /barberq/* routes, wrapped in AuthProvider
    context/
      AuthContext.tsx   # accessToken in memory, login/logout actions, useAuth hook
    components/
      ProtectedRoute.tsx  # Redirects to login if no accessToken
      LoginForm.tsx       # Handles client + business login
      RegisterForm.tsx    # Handles client + business registration
      Navbar, Hero, Features, HowItWorks, Footer
    pages/
      Landing, ClientLogin, BusinessLogin, ClientRegister, BusinessRegister
      Barbers.tsx           # Protected — available barbers list (empty state)
      BusinessDashboard.tsx # Protected — lists services, Add service button
      AddService.tsx        # Protected — form to add a new service
  lambdas/
    auth/
      register_client.py   # Client registration → Cognito SignUp
      login_client.py      # Client login → HttpOnly cookie + accessToken
      register_business.py # Business registration → Cognito SignUp (business pool)
      login_business.py    # Business login → same cookie pattern
    services/
      add_service.py       # POST /services → DynamoDB PutItem
      list_services.py     # GET /services → DynamoDB Query by businessId
  infra/
    main.tf             # Provider config
    cognito.tf          # Client + business Cognito pools and app clients
    lambda.tf           # IAM role + all six Lambda functions
    dynamodb.tf         # barberq-services table
    variables.tf        # allowed_origin variable
    terraform.tfvars    # Variable values (gitignored)
    outputs.tf          # Pool IDs, Lambda ARNs
```

## User Pools

| Pool             | Status   | Purpose                        |
|------------------|----------|--------------------------------|
| barberq-clients  | Deployed | Customers booking appointments |
| barberq-business | Deployed | Barbers offering services      |

## Routes

| Path                                        | Page               | Protected |
|---------------------------------------------|--------------------|-----------|
| `/barberq`                                  | Landing page       | No        |
| `/barberq/login/client`                     | Client login       | No        |
| `/barberq/login/business`                   | Business login     | No        |
| `/barberq/register/client`                  | Client register    | No        |
| `/barberq/register/business`               | Business register  | No        |
| `/barberq/barbers`                          | Available barbers  | Yes       |
| `/barberq/dashboard/business`               | Business dashboard | Yes       |
| `/barberq/dashboard/business/add-service`   | Add service        | Yes       |

## Next Steps

1. Token refresh — Lambda reads `refreshToken` cookie, returns new `accessToken`, called on app mount in `AuthContext`
2. Availability section — TBD

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
