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
    Statement = [
      {
        Effect = "Allow"
        Action = ["cognito-idp:SignUp", "cognito-idp:InitiateAuth"]
        Resource = [
          aws_cognito_user_pool.clients.arn,
          aws_cognito_user_pool.business.arn,
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["cognito-idp:ListUsers"]
        Resource = [aws_cognito_user_pool.business.arn]
      }
    ]
  })
}

# Allow Lambda to read/write DynamoDB tables
resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "barberq-lambda-dynamodb-policy"
  role = aws_iam_role.lambda_auth.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["dynamodb:PutItem", "dynamodb:Query", "dynamodb:GetItem"]
      Resource = [
        aws_dynamodb_table.services.arn,
        aws_dynamodb_table.availability.arn,
        aws_dynamodb_table.bookings.arn,
      ]
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

# --- List services Lambda ---

data "archive_file" "list_services" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/services/list_services.py"
  output_path = "${path.module}/../lambdas/services/list_services.zip"
}

resource "aws_lambda_function" "list_services" {
  function_name    = "barberq-list-services"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "list_services.handler"
  filename         = data.archive_file.list_services.output_path
  source_code_hash = data.archive_file.list_services.output_base64sha256

  environment {
    variables = {
      SERVICES_TABLE = aws_dynamodb_table.services.name
      ALLOWED_ORIGIN = var.allowed_origin
    }
  }
}

# --- Get availability Lambda ---

data "archive_file" "get_availability" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/availability/get_availability.py"
  output_path = "${path.module}/../lambdas/availability/get_availability.zip"
}

resource "aws_lambda_function" "get_availability" {
  function_name    = "barberq-get-availability"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "get_availability.handler"
  filename         = data.archive_file.get_availability.output_path
  source_code_hash = data.archive_file.get_availability.output_base64sha256

  environment {
    variables = {
      AVAILABILITY_TABLE = aws_dynamodb_table.availability.name
      ALLOWED_ORIGIN     = var.allowed_origin
    }
  }
}

# --- Set availability Lambda ---

data "archive_file" "set_availability" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/availability/set_availability.py"
  output_path = "${path.module}/../lambdas/availability/set_availability.zip"
}

resource "aws_lambda_function" "set_availability" {
  function_name    = "barberq-set-availability"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "set_availability.handler"
  filename         = data.archive_file.set_availability.output_path
  source_code_hash = data.archive_file.set_availability.output_base64sha256

  environment {
    variables = {
      AVAILABILITY_TABLE = aws_dynamodb_table.availability.name
      ALLOWED_ORIGIN     = var.allowed_origin
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

# --- Get barbers Lambda ---

data "archive_file" "get_barbers" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/bookings/get_barbers.py"
  output_path = "${path.module}/../lambdas/bookings/get_barbers.zip"
}

resource "aws_lambda_function" "get_barbers" {
  function_name    = "barberq-get-barbers"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "get_barbers.handler"
  filename         = data.archive_file.get_barbers.output_path
  source_code_hash = data.archive_file.get_barbers.output_base64sha256

  environment {
    variables = {
      BUSINESS_POOL_ID = aws_cognito_user_pool.business.id
      ALLOWED_ORIGIN   = var.allowed_origin
    }
  }
}

# --- Get business services Lambda ---

data "archive_file" "get_business_services" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/bookings/get_business_services.py"
  output_path = "${path.module}/../lambdas/bookings/get_business_services.zip"
}

resource "aws_lambda_function" "get_business_services" {
  function_name    = "barberq-get-business-services"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "get_business_services.handler"
  filename         = data.archive_file.get_business_services.output_path
  source_code_hash = data.archive_file.get_business_services.output_base64sha256

  environment {
    variables = {
      SERVICES_TABLE = aws_dynamodb_table.services.name
      ALLOWED_ORIGIN = var.allowed_origin
    }
  }
}

# --- Get barber slots Lambda ---

data "archive_file" "get_barber_slots" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/bookings/get_barber_slots.py"
  output_path = "${path.module}/../lambdas/bookings/get_barber_slots.zip"
}

resource "aws_lambda_function" "get_barber_slots" {
  function_name    = "barberq-get-barber-slots"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "get_barber_slots.handler"
  filename         = data.archive_file.get_barber_slots.output_path
  source_code_hash = data.archive_file.get_barber_slots.output_base64sha256

  environment {
    variables = {
      SERVICES_TABLE     = aws_dynamodb_table.services.name
      AVAILABILITY_TABLE = aws_dynamodb_table.availability.name
      BOOKINGS_TABLE     = aws_dynamodb_table.bookings.name
      ALLOWED_ORIGIN     = var.allowed_origin
    }
  }
}

# --- Create booking Lambda ---

data "archive_file" "create_booking" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/bookings/create_booking.py"
  output_path = "${path.module}/../lambdas/bookings/create_booking.zip"
}

resource "aws_lambda_function" "create_booking" {
  function_name    = "barberq-create-booking"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "create_booking.handler"
  filename         = data.archive_file.create_booking.output_path
  source_code_hash = data.archive_file.create_booking.output_base64sha256

  environment {
    variables = {
      SERVICES_TABLE = aws_dynamodb_table.services.name
      BOOKINGS_TABLE = aws_dynamodb_table.bookings.name
      ALLOWED_ORIGIN = var.allowed_origin
    }
  }
}

# --- List business bookings Lambda ---

data "archive_file" "list_business_bookings" {
  type        = "zip"
  source_file = "${path.module}/../lambdas/bookings/list_business_bookings.py"
  output_path = "${path.module}/../lambdas/bookings/list_business_bookings.zip"
}

resource "aws_lambda_function" "list_business_bookings" {
  function_name    = "barberq-list-business-bookings"
  role             = aws_iam_role.lambda_auth.arn
  runtime          = "python3.12"
  handler          = "list_business_bookings.handler"
  filename         = data.archive_file.list_business_bookings.output_path
  source_code_hash = data.archive_file.list_business_bookings.output_base64sha256

  environment {
    variables = {
      BOOKINGS_TABLE = aws_dynamodb_table.bookings.name
      ALLOWED_ORIGIN = var.allowed_origin
    }
  }
}
