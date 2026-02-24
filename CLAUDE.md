# serverless-lab-one

A monorepo containing a personal portfolio and serverless project experiments on AWS.

---

## 1. Portfolio (`/src`, `/infra`)

Personal portfolio page — React SPA hosted on S3 + CloudFront, infrastructure managed with Terraform.

### Architecture

```
Browser → CloudFront (CDN) → S3 (static hosting)
```

| Layer    | Service        | Notes                               |
|----------|----------------|-------------------------------------|
| Frontend | React (Vite)   | SPA, single `index.html` entrypoint |
| Hosting  | AWS S3         | Static website hosting              |
| CDN      | AWS CloudFront | HTTPS, caching, custom error pages  |
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
infra/                # Terraform — S3 + CloudFront
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
npm run build
aws s3 sync dist/ s3://serverless-lab-one-portfolio --delete --profile kidnoti
aws cloudfront create-invalidation --distribution-id <id> --paths "/*" --profile kidnoti
```

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
- State files (`terraform.tfstate`) and `.terraform/` directories must never be committed.
