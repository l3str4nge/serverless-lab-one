# serverless-lab-one

Personal portfolio project — 100% serverless on AWS.

## Project Status

**Current phase:** Frontend only — React SPA hosted on S3 + CloudFront.

Architecture will grow incrementally. Update this file as new AWS services are added.

## Architecture

```
Browser → CloudFront (CDN) → S3 (static hosting)
```

| Layer      | Service                  | Notes                                  |
|------------|--------------------------|----------------------------------------|
| Frontend   | React (Vite)             | SPA, single `index.html` entrypoint    |
| Hosting    | AWS S3                   | Static website hosting, versioning on  |
| CDN        | AWS CloudFront           | HTTPS, caching, custom error pages     |

## Stack

- **Frontend:** React 18, Vite
- **Language:** TypeScript
- **Styling:** TBD
- **IaC:** TBD (likely AWS CDK or Terraform)
- **CI/CD:** TBD

## Project Structure

```
serverless-lab-one/
├── src/             # React source code
├── public/          # Static assets
├── dist/            # Vite build output — deployed to S3
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Key Conventions

- Build output goes to `dist/` — this is what gets uploaded to S3.
- CloudFront must be configured with a custom error page: 404 → `/index.html` (status 200) for client-side routing to work.
- S3 bucket should NOT have public access enabled directly; traffic must go through CloudFront only.

## Common Commands

```bash
npm run dev      # Local dev server (Vite)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

## Deployment

Manual steps until CI/CD is set up:

1. `npm run build`
2. `aws s3 sync dist/ s3://<bucket-name> --delete`
3. `aws cloudfront create-invalidation --distribution-id <id> --paths "/*"`

## Notes for Claude

- This project grows incrementally. Do not add AWS services or infrastructure beyond what is listed in the Architecture table above.
- Prefer simple, direct solutions. Avoid over-engineering.
- When adding a new AWS service, update the Architecture table and add a section for it here.
- Do not auto-commit or auto-push.
