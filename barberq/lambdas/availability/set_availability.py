import json
import os
import base64
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["AVAILABILITY_TABLE"])
ALLOWED_ORIGIN = os.environ["ALLOWED_ORIGIN"]

VALID_DAYS = {"MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"}


def handler(event, context):
    try:
        business_id = extract_sub(event)
        if not business_id:
            return respond(401, {"message": "Unauthorized."})

        body = json.loads(event.get("body", "{}"))
        schedule = body.get("schedule", [])

        if not schedule:
            return respond(400, {"message": "Missing schedule."})

        for entry in schedule:
            day = entry.get("day")
            start_time = entry.get("startTime")
            end_time = entry.get("endTime")
            is_available = entry.get("isAvailable", False)

            if day not in VALID_DAYS or not start_time or not end_time:
                return respond(400, {"message": f"Invalid entry for day: {day}"})

            table.put_item(Item={
                "businessId": business_id,
                "day": day,
                "startTime": start_time,
                "endTime": end_time,
                "isAvailable": bool(is_available),
            })

        return respond(200, {"message": "Availability saved."})

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
