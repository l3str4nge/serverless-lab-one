import json
import os
import boto3
from botocore.exceptions import ClientError

cognito = boto3.client("cognito-idp")

APP_CLIENT_ID = os.environ["APP_CLIENT_ID"]


def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        email = body.get("email")
        password = body.get("password")
        business_name = body.get("businessName")
        owner_name = body.get("ownerName")

        if not all([email, password, business_name, owner_name]):
            return response(400, {"message": "Missing required fields."})

        cognito.sign_up(
            ClientId=APP_CLIENT_ID,
            Username=email,
            Password=password,
            UserAttributes=[
                {"Name": "email", "Value": email},
                {"Name": "name", "Value": owner_name},
                {"Name": "custom:business_name", "Value": business_name},
            ],
        )

        return response(201, {"message": "Registration successful. Please check your email to verify your account."})

    except ClientError as e:
        return handle_cognito_error(e)


def handle_cognito_error(e: ClientError) -> dict:
    code = e.response["Error"]["Code"]
    if code == "UsernameExistsException":
        return response(409, {"message": "An account with this email already exists."})
    if code == "InvalidPasswordException":
        return response(400, {"message": "Password does not meet requirements."})
    if code == "InvalidParameterException":
        return response(400, {"message": "Invalid input."})
    return response(500, {"message": "Something went wrong. Please try again."})


def response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(body),
    }
