# serverless-lab-one

A monorepo containing a personal portfolio and serverless project experiments on AWS.

---

## 1. Portfolio (`/src`, `/infra`)

Personal portfolio page — React SPA hosted on S3 + CloudFront, infrastructure managed with Terraform.

### Architecture

```
Browser → CloudFront → S3 (static assets)
                    → API Gateway (BarberQ API, /api/* paths)
```

| Layer    | Service        | Notes                               |
|----------|----------------|-------------------------------------|
| Frontend | React (Vite)   | SPA, single `index.html` entrypoint |
| Hosting  | AWS S3         | Static website hosting              |
| CDN      | AWS CloudFront | HTTPS, caching, custom error pages; `/api/*` proxied to API Gateway via CloudFront Function |
| IaC      | Terraform      | `infra/` directory, profile: kidnoti, region: eu-north-1 |

### Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS v4
- **IaC:** Terraform
- **CI/CD:** TBD

### Project Structure

```
src/                  # React source
  components/         # Hero, About, Projects, Resume, Paintings, Contact
  context/            # ThemeContext (dark/light mode)
infra/                # Terraform — S3 + CloudFront + CloudFront Function
  variables.tf        # api_gateway_domain variable
  terraform.tfvars    # Variable values (gitignored)
dist/                 # Build output — deployed to S3
```

### Common Commands

```bash
npm run dev      # Local dev server
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

### Deployment

```bash
# 1. Deploy infra changes (if any)
cd infra && /opt/homebrew/bin/terraform apply

# 2. Build and sync to S3
npm run build
aws s3 sync dist/ s3://serverless-lab-one-portfolio --delete --profile kidnoti

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id $(cd infra && /opt/homebrew/bin/terraform output -raw cloudfront_distribution_id) --paths "/*" --profile kidnoti
```

CloudFront URL: `https://d2qebwuuo4q2ld.cloudfront.net`

**How `/api/*` routing works in production:**
CloudFront Function (`barberq-api-rewrite`) rewrites `/api/foo` → `/dev/foo` before forwarding to the API Gateway origin. Mirrors the Vite dev proxy exactly — no frontend code changes needed between dev and prod.

---

## 2. BarberQ (`/barberq`)

POC for a barbershop booking platform. See `barberq/CLAUDE.md` for full details.

---

## General Notes for Claude

- AWS profile: `kidnoti`, region: `eu-north-1`
- Terraform binary: `/opt/homebrew/bin/terraform` (arm64)
- Do not add AWS services beyond what is listed in the Architecture tables above.
- When adding a new AWS service, update the relevant Architecture table.
- Do not auto-commit or auto-push — use `/cap` command when asked.
- Prefer simple, direct solutions. Avoid over-engineering.
- State files (`terraform.tfstate`), `.terraform/` directories, and `terraform.tfvars` must never be committed.
