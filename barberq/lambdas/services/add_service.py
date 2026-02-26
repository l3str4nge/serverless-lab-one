import json
import os
import uuid
import base64
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["SERVICES_TABLE"])
ALLOWED_ORIGIN = os.environ["ALLOWED_ORIGIN"]


def handler(event, context):
    try:
        business_id = extract_sub(event)
        if not business_id:
            return respond(401, {"message": "Unauthorized."})

        body = json.loads(event.get("body", "{}"))
        name = body.get("name")
        price = body.get("price")
        duration = body.get("durationMinutes")

        if not all([name, price is not None, duration]):
            return respond(400, {"message": "Missing required fields."})

        service_id = str(uuid.uuid4())

        table.put_item(Item={
            "businessId": business_id,
            "serviceId": service_id,
            "name": name,
            "price": str(price),  # DynamoDB Decimal-safe
            "durationMinutes": int(duration),
        })

        return respond(201, {"serviceId": service_id, "message": "Service added."})

    except ClientError:
        return respond(500, {"message": "Something went wrong. Please try again."})


def extract_sub(event):
    """Decode the JWT from the Authorization header and return the sub claim."""
    try:
        auth = event.get("headers", {}).get("Authorization", "")
        token = auth.removeprefix("Bearer ")
        # JWT is three base64url segments — payload is the middle one
        payload_b64 = token.split(".")[1]
        # Add padding if needed
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
