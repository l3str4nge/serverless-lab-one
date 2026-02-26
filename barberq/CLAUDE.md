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
| Backend  | AWS Lambda (Python) | Auth + services + bookings lambdas — all deployed  |
| Database | AWS DynamoDB        | `barberq-services`, `barberq-availability`, `barberq-bookings` |
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
- [ ] Lambda `barberq-get-availability` — needs deploy + API Gateway wiring
- [ ] Lambda `barberq-set-availability` — needs deploy + API Gateway wiring
- [ ] DynamoDB `barberq-availability` — needs deploy
- [ ] Lambda `barberq-get-barbers` — needs deploy + API Gateway wiring
- [ ] Lambda `barberq-get-business-services` — needs deploy + API Gateway wiring
- [ ] Lambda `barberq-get-barber-slots` — needs deploy + API Gateway wiring
- [ ] Lambda `barberq-create-booking` — needs deploy + API Gateway wiring
- [ ] Lambda `barberq-list-business-bookings` — needs deploy + API Gateway wiring
- [ ] DynamoDB `barberq-bookings` — needs deploy
- [x] Frontend wired to API via Vite proxy (`/api/*` → API Gateway)
- [x] AuthContext — accessToken stored in React memory
- [x] ProtectedRoute — redirects to login if not authenticated
- [x] BusinessDashboard — lists services, availability summary, upcoming bookings
- [x] AddService page — form wired to POST /api/services
- [x] Barbers page — lists barbers fetched from GET /api/barbers
- [x] BarberProfile page — 3-step booking flow (service → slot → confirm)
- [ ] Token refresh — accessToken lost on page reload (refreshToken cookie exists, no refresh Lambda yet)

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

## Availability Flow

- **Get availability:** GET `/api/availability` — Bearer token, queries `barberq-availability` by `businessId`; returns `{ schedule: [{ day, startTime, endTime, isAvailable }] }`
- **Set availability:** PUT `/api/availability` — Bearer token, body `{ schedule: [...] }` (all 7 days); loops PutItem for each day
- DynamoDB table: `barberq-availability` (PK: `businessId`, SK: `day`)

## Booking Flow

- **GET `/api/barbers`** (public) — `get_barbers.py` — lists users from business Cognito pool (businessId = Cognito username, name = email)
- **GET `/api/barbers/{businessId}/services`** (public) — `get_business_services.py` — queries `barberq-services` by businessId
- **GET `/api/barbers/{businessId}/slots?serviceId=...`** (public) — `get_barber_slots.py` — computes next 10 available slots over 14 days from weekly schedule, excluding booked slots
- **POST `/api/bookings`** (client auth) — `create_booking.py` — validates slot, fetches service name, writes to `barberq-bookings`
- **GET `/api/bookings/business`** (business auth) — `list_business_bookings.py` — queries bookings by businessId, filters date >= today + status = confirmed
- DynamoDB table: `barberq-bookings` (PK: `businessId`, SK: `bookingId`)

## Manual API Gateway wiring (after `terraform apply`)

Add to existing API (`y32snw82t3`, `dev` stage):

| Method | Path | Lambda |
|--------|------|--------|
| GET | `/barbers` | `barberq-get-barbers` |
| OPTIONS | `/barbers` | MOCK |
| GET | `/barbers/{businessId}/services` | `barberq-get-business-services` |
| OPTIONS | `/barbers/{businessId}/services` | MOCK |
| GET | `/barbers/{businessId}/slots` | `barberq-get-barber-slots` |
| OPTIONS | `/barbers/{businessId}/slots` | MOCK |
| POST | `/bookings` | `barberq-create-booking` |
| GET | `/bookings/business` | `barberq-list-business-bookings` |
| OPTIONS | `/bookings` | MOCK |
| OPTIONS | `/bookings/business` | MOCK |

Also wire pending availability endpoints:

| Method | Path | Lambda |
|--------|------|--------|
| GET | `/availability` | `barberq-get-availability` |
| PUT | `/availability` | `barberq-set-availability` |
| OPTIONS | `/availability` | MOCK |

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
      Barbers.tsx           # Protected — lists barbers from GET /api/barbers
      BarberProfile.tsx     # Protected — 3-step booking flow (service → slot → confirm)
      BusinessDashboard.tsx # Protected — services, availability, upcoming bookings
      AddService.tsx        # Protected — form to add a new service
      SetAvailability.tsx   # Protected — weekly schedule picker (Mon–Sun)
  lambdas/
    auth/
      register_client.py   # Client registration → Cognito SignUp
      login_client.py      # Client login → HttpOnly cookie + accessToken
      register_business.py # Business registration → Cognito SignUp (business pool)
      login_business.py    # Business login → same cookie pattern
    services/
      add_service.py       # POST /services → DynamoDB PutItem
      list_services.py     # GET /services → DynamoDB Query by businessId
    availability/
      get_availability.py  # GET /availability → DynamoDB Query by businessId
      set_availability.py  # PUT /availability → DynamoDB PutItem per day
    bookings/
      get_barbers.py           # GET /barbers → Cognito ListUsers (business pool)
      get_business_services.py # GET /barbers/{id}/services → DynamoDB Query
      get_barber_slots.py      # GET /barbers/{id}/slots → compute available slots
      create_booking.py        # POST /bookings → DynamoDB PutItem
      list_business_bookings.py # GET /bookings/business → DynamoDB Query
  infra/
    main.tf             # Provider config
    cognito.tf          # Client + business Cognito pools and app clients
    lambda.tf           # IAM role + all Lambda functions
    dynamodb.tf         # barberq-services + barberq-availability + barberq-bookings
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

| Path                                             | Page               | Protected |
|--------------------------------------------------|--------------------|-----------|
| `/barberq`                                       | Landing page       | No        |
| `/barberq/login/client`                          | Client login       | No        |
| `/barberq/login/business`                        | Business login     | No        |
| `/barberq/register/client`                       | Client register    | No        |
| `/barberq/register/business`                     | Business register  | No        |
| `/barberq/barbers`                               | Barbers list       | Yes       |
| `/barberq/barbers/:businessId`                   | Barber profile + booking | Yes |
| `/barberq/dashboard/business`                    | Business dashboard | Yes       |
| `/barberq/dashboard/business/add-service`        | Add service        | Yes       |
| `/barberq/dashboard/business/set-availability`   | Set availability   | Yes       |

## Next Steps

1. Token refresh — Lambda reads `refreshToken` cookie, returns new `accessToken`, called on app mount in `AuthContext`

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
- `get_barbers.py` uses Cognito username as `businessId` (not `sub` attribute) — Cognito `Username` field matches the UUID sub for user pools with email sign-in
