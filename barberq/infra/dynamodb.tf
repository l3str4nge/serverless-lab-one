resource "aws_dynamodb_table" "services" {
  name         = "barberq-services"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "businessId"
  range_key    = "serviceId"

  attribute {
    name = "businessId"
    type = "S"
  }

  attribute {
    name = "serviceId"
    type = "S"
  }
}
