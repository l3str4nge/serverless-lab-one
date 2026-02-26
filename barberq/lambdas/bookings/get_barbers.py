import json
import os
import boto3
from botocore.exceptions import ClientError

cognito = boto3.client("cognito-idp")
BUSINESS_POOL_ID = os.environ["BUSINESS_POOL_ID"]
ALLOWED_ORIGIN = os.environ["ALLOWED_ORIGIN"]


def handler(event, context):
    try:
        barbers = []
        paginator = cognito.get_paginator("list_users")
        for page in paginator.paginate(UserPoolId=BUSINESS_POOL_ID):
            for user in page["Users"]:
                user_id = user["Username"]
                email = next(
                    (a["Value"] for a in user["Attributes"] if a["Name"] == "email"),
                    user_id,
                )
                barbers.append({"businessId": user_id, "name": email})

        return respond(200, {"barbers": barbers})

    except ClientError:
        return respond(500, {"message": "Something went wrong. Please try again."})


def respond(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            "Access-Control-Allow-Credentials": "true",
        },
        "body": json.dumps(body),
    }
