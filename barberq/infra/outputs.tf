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
