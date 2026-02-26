# IAM role for auth Lambdas
resource "aws_iam_role" "lambda_auth" {
  name = "barberq-lambda-auth-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# Allow Lambda to write logs
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_auth.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Allow Lambda to call Cognito
resource "aws_iam_role_policy" "lambda_cognito" {
  name = "barberq-lambda-cognito-policy"
  role = aws_iam_role.lambda_auth.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["cognito-idp:SignUp", "cognito-idp:InitiateAuth"]
      Resource = [
        aws_cognito_user_pool.clients.arn,
        aws_cognito_user_pool.business.arn,
      ]
    }]
  })
}

# Allow Lambda to write to DynamoDB
resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "barberq-lambda-dynamodb-policy"
  role = aws_iam_role.lambda_auth.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["dynamodb:PutItem", "dynamodb:Query"]
      Resource = [aws_dynamodb_table.services.arn]
    }]
  })
}

# --- Add service Lambda ---

data "archive_file" "add_service" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/services/add_service.py"
  output_path = "${path.module}/../lambdas/services/add_service.zip"
}

resource "aws_lambda_function" "add_service" {
  function_name    = "barberq-add-service"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "add_service.handler"
  filename         = data.archive_file.add_service.output_path
  source_code_hash = data.archive_file.add_service.output_base64sha256

  environment {
    variables = {
      SERVICES_TABLE = aws_dynamodb_table.services.name
      ALLOWED_ORIGIN = var.allowed_origin
    }
  }
}

# --- Client registration Lambda ---


data "archive_file" "register_client" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/auth/register_client.py"
  output_path = "${path.module}/../lambdas/auth/register_client.zip"
}

resource "aws_lambda_function" "register_client" {
  function_name    = "barberq-register-client"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "register_client.handler"
  filename         = data.archive_file.register_client.output_path
  source_code_hash = data.archive_file.register_client.output_base64sha256

  environment {
    variables = {
      APP_CLIENT_ID = aws_cognito_user_pool_client.clients_app.id
    }
  }
}

# --- Business registration Lambda ---

data "archive_file" "register_business" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/auth/register_business.py"
  output_path = "${path.module}/../lambdas/auth/register_business.zip"
}

resource "aws_lambda_function" "register_business" {
  function_name    = "barberq-register-business"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "register_business.handler"
  filename         = data.archive_file.register_business.output_path
  source_code_hash = data.archive_file.register_business.output_base64sha256

  environment {
    variables = {
      APP_CLIENT_ID = aws_cognito_user_pool_client.business_app.id
    }
  }
}

# --- Business login Lambda ---

data "archive_file" "login_business" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/auth/login_business.py"
  output_path = "${path.module}/../lambdas/auth/login_business.zip"
}

resource "aws_lambda_function" "login_business" {
  function_name    = "barberq-login-business"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "login_business.handler"
  filename         = data.archive_file.login_business.output_path
  source_code_hash = data.archive_file.login_business.output_base64sha256

  environment {
    variables = {
      APP_CLIENT_ID  = aws_cognito_user_pool_client.business_app.id
      ALLOWED_ORIGIN = var.allowed_origin
    }
  }
}

# --- Client login Lambda ---

data "archive_file" "login_client" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/auth/login_client.py"
  output_path = "${path.module}/../lambdas/auth/login_client.zip"
}

resource "aws_lambda_function" "login_client" {
  function_name    = "barberq-login-client"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "login_client.handler"
  filename         = data.archive_file.login_client.output_path
  source_code_hash = data.archive_file.login_client.output_base64sha256

  environment {
    variables = {
      APP_CLIENT_ID  = aws_cognito_user_pool_client.clients_app.id
      ALLOWED_ORIGIN = var.allowed_origin
    }
  }
}
