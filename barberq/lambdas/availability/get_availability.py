import json
import os
import base64
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["AVAILABILITY_TABLE"])
ALLOWED_ORIGIN = os.environ["ALLOWED_ORIGIN"]


def handler(event, context):
    try:
        business_id = extract_sub(event)
        if not business_id:
            return respond(401, {"message": "Unauthorized."})

        result = table.query(
            KeyConditionExpression=Key("businessId").eq(business_id)
        )

        schedule = [
            {
                "day": item["day"],
                "startTime": item["startTime"],
                "endTime": item["endTime"],
                "isAvailable": bool(item["isAvailable"]),
            }
            for item in result.get("Items", [])
        ]

        return respond(200, {"schedule": schedule})

    except ClientError:
        return respond(500, {"message": "Something went wrong. Please try again."})


def extract_sub(event):
    """Decode the JWT from the Authorization header and return the sub claim."""
    try:
        auth = event.get("headers", {}).get("Authorization", "")
        token = auth.removeprefix("Bearer ")
        payload_b64 = token.split(".")[1]
        payload_b64 += "=" * (-len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64))
        return payload.get("sub")
    except Exception:
        return None


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
