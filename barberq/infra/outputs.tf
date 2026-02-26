output "client_pool_id" {
  description = "Cognito client user pool ID"
  value       = aws_cognito_user_pool.clients.id
}

output "client_pool_client_id" {
  description = "Cognito app client ID"
  value       = aws_cognito_user_pool_client.clients_app.id
}

output "register_client_lambda_arn" {
  description = "Client registration Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.register_client.arn
}

output "login_client_lambda_arn" {
  description = "Client login Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.login_client.arn
}

output "business_pool_id" {
  description = "Cognito business user pool ID"
  value       = aws_cognito_user_pool.business.id
}

output "business_pool_client_id" {
  description = "Cognito business app client ID"
  value       = aws_cognito_user_pool_client.business_app.id
}

output "register_business_lambda_arn" {
  description = "Business registration Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.register_business.arn
}

output "login_business_lambda_arn" {
  description = "Business login Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.login_business.arn
}

output "add_service_lambda_arn" {
  description = "Add service Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.add_service.arn
}
