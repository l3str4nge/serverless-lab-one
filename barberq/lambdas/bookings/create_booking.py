import json
import os
import base64
import uuid
import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError
from datetime import datetime, timezone

dynamodb = boto3.resource("dynamodb")
bookings_table = dynamodb.Table(os.environ["BOOKINGS_TABLE"])
services_table = dynamodb.Table(os.environ["SERVICES_TABLE"])
ALLOWED_ORIGIN = os.environ["ALLOWED_ORIGIN"]


def handler(event, context):
    try:
        client_id = extract_sub(event)
        if not client_id:
            return respond(401, {"message": "Unauthorized."})

        body = json.loads(event.get("body") or "{}")
        business_id = body.get("businessId")
        service_id = body.get("serviceId")
        date = body.get("date")
        start_time = body.get("startTime")
        end_time = body.get("endTime")

        if not all([business_id, service_id, date, start_time, end_time]):
            return respond(400, {"message": "Missing required fields."})

        # Check slot not already taken
        existing = bookings_table.query(
            KeyConditionExpression=Key("businessId").eq(business_id),
            FilterExpression=Attr("date").eq(date)
            & Attr("startTime").eq(start_time)
            & Attr("status").eq("confirmed"),
        )
        if existing.get("Count", 0) > 0:
            return respond(409, {"message": "This slot is already booked."})

        # Fetch service name
        svc_result = services_table.get_item(
            Key={"businessId": business_id, "serviceId": service_id}
        )
        svc = svc_result.get("Item")
        if not svc:
            return respond(404, {"message": "Service not found."})

        # Compute TTL — expire at the appointment's end time
        end_dt = datetime.strptime(f"{date} {end_time}", "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
        ttl = int(end_dt.timestamp())

        booking_id = str(uuid.uuid4())
        bookings_table.put_item(
            Item={
                "businessId": business_id,
                "bookingId": booking_id,
                "clientId": client_id,
                "serviceId": service_id,
                "serviceName": svc["name"],
                "date": date,
                "startTime": start_time,
                "endTime": end_time,
                "durationMinutes": int(svc["durationMinutes"]),
                "status": "confirmed",
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "ttl": ttl,
            }
        )

        return respond(201, {"bookingId": booking_id})

    except ClientError:
        return respond(500, {"message": "Something went wrong. Please try again."})


def extract_sub(event):
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
