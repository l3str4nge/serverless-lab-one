resource "aws_cognito_user_pool" "clients" {
  name = "barberq-clients"

  # Users sign in with email
  username_attributes = ["email"]

  # Automatically verify email after registration
  auto_verified_attributes = ["email"]

  # Password requirements
  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
  }

  # Email verification message
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "BarberQ - verify your email"
    email_message        = "Your verification code is {####}"
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
}

# App client — used by Lambda to talk to Cognito
resource "aws_cognito_user_pool_client" "clients_app" {
  name         = "barberq-clients-app"
  user_pool_id = aws_cognito_user_pool.clients.id

  # No secret — Lambda will use IAM permissions instead
  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]
}

# --- Business user pool ---

resource "aws_cognito_user_pool" "business" {
  name = "barberq-business"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "BarberQ - verify your email"
    email_message        = "Your verification code is {####}"
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  schema {
    name                = "business_name"
    attribute_data_type = "String"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
}

resource "aws_cognito_user_pool_client" "business_app" {
  name         = "barberq-business-app"
  user_pool_id = aws_cognito_user_pool.business.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]
}
