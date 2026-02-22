output "client_pool_id" {
  description = "Cognito client user pool ID"
  value       = aws_cognito_user_pool.clients.id
}

output "client_pool_client_id" {
  description = "Cognito app client ID"
  value       = aws_cognito_user_pool_client.clients_app.id
}
