import json
import os
import boto3
from botocore.exceptions import ClientError

cognito = boto3.client("cognito-idp")

APP_CLIENT_ID = os.environ["APP_CLIENT_ID"]
ALLOWED_ORIGIN = os.environ["ALLOWED_ORIGIN"]


def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        email = body.get("email")
        password = body.get("password")

        if not all([email, password]):
            return response(400, {"message": "Missing required fields."})

        result = cognito.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": email,
                "PASSWORD": password,
            },
            ClientId=APP_CLIENT_ID,
        )

        tokens = result["AuthenticationResult"]
        refresh_token = tokens["RefreshToken"]
        access_token = tokens["AccessToken"]

        cookie = (
            f"refreshToken={refresh_token}; "
            "HttpOnly; Secure; SameSite=None; Path=/; Max-Age=2592000"
        )

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
                "Access-Control-Allow-Credentials": "true",
                "Set-Cookie": cookie,
            },
            "body": json.dumps({"accessToken": access_token}),
        }

    except ClientError as e:
        return handle_cognito_error(e)


def handle_cognito_error(e: ClientError) -> dict:
    code = e.response["Error"]["Code"]
    if code == "NotAuthorizedException":
        return response(401, {"message": "Incorrect email or password."})
    if code == "UserNotConfirmedException":
        return response(403, {"message": "Please verify your email before logging in."})
    if code == "UserNotFoundException":
        return response(401, {"message": "Incorrect email or password."})
    return response(500, {"message": "Something went wrong. Please try again."})


def response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            "Access-Control-Allow-Credentials": "true",
        },
        "body": json.dumps(body),
    }
