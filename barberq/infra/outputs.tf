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

output "list_services_lambda_arn" {
  description = "List services Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.list_services.arn
}

output "get_availability_lambda_arn" {
  description = "Get availability Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.get_availability.arn
}

output "set_availability_lambda_arn" {
  description = "Set availability Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.set_availability.arn
}

output "get_barbers_lambda_arn" {
  description = "Get barbers Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.get_barbers.arn
}

output "get_business_services_lambda_arn" {
  description = "Get business services Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.get_business_services.arn
}

output "get_barber_slots_lambda_arn" {
  description = "Get barber slots Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.get_barber_slots.arn
}

output "create_booking_lambda_arn" {
  description = "Create booking Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.create_booking.arn
}

output "list_business_bookings_lambda_arn" {
  description = "List business bookings Lambda ARN — use when wiring API Gateway manually"
  value       = aws_lambda_function.list_business_bookings.arn
}
