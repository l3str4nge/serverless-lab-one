# serverless-lab-one

Personal portfolio project built 100% serverless on AWS.

## Stack

- **Frontend:** React + Vite + TypeScript
- **Hosting:** AWS S3
- **CDN:** AWS CloudFront

## Architecture

```
Browser → CloudFront → S3
```

Static React SPA served via CloudFront with S3 as the origin. No servers, no containers.

## Status

Work in progress. Architecture will grow incrementally.
