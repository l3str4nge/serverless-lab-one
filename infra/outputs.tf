output "cloudfront_url" {
  description = "Portfolio URL"
  value       = "https://${aws_cloudfront_distribution.portfolio.domain_name}"
}

output "s3_bucket_name" {
  description = "S3 bucket name for deployments"
  value       = aws_s3_bucket.portfolio.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation"
  value       = aws_cloudfront_distribution.portfolio.id
}
