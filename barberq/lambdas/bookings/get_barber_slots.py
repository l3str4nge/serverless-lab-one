import json
import os
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
from datetime import date, timedelta

dynamodb = boto3.resource("dynamodb")
services_table = dynamodb.Table(os.environ["SERVICES_TABLE"])
availability_table = dynamodb.Table(os.environ["AVAILABILITY_TABLE"])
bookings_table = dynamodb.Table(os.environ["BOOKINGS_TABLE"])
ALLOWED_ORIGIN = os.environ["ALLOWED_ORIGIN"]


def handler(event, context):
    try:
        path_params = event.get("pathParameters") or {}
        query_params = event.get("queryStringParameters") or {}
        business_id = path_params.get("businessId")
        service_id = query_params.get("serviceId")

        if not business_id or not service_id:
            return respond(400, {"message": "Missing businessId or serviceId."})

        # Fetch service duration
        svc_result = services_table.get_item(
            Key={"businessId": business_id, "serviceId": service_id}
        )
        svc = svc_result.get("Item")
        if not svc:
            return respond(404, {"message": "Service not found."})
        duration = int(svc["durationMinutes"])

        # Fetch weekly schedule
        avail_result = availability_table.query(
            KeyConditionExpression=Key("businessId").eq(business_id)
        )
        schedule = {
            item["day"]: item
            for item in avail_result.get("Items", [])
        }

        # Fetch all existing bookings for this business
        bookings_result = bookings_table.query(
            KeyConditionExpression=Key("businessId").eq(business_id)
        )
        bookings = bookings_result.get("Items", [])

        # Compute available slots for the next 14 days
        today = date.today()
        available = []

        for i in range(1, 15):
            d = today + timedelta(days=i)
            day_key = d.strftime("%a").upper()[:3]

            avail = schedule.get(day_key)
            if not avail or not avail.get("isAvailable"):
                continue

            start_h, start_m = map(int, str(avail["startTime"]).split(":"))
            end_h, end_m = map(int, str(avail["endTime"]).split(":"))
            start_minutes = start_h * 60 + start_m
            end_minutes = end_h * 60 + end_m

            date_str = d.strftime("%Y-%m-%d")
            booked_starts = {
                b["startTime"]
                for b in bookings
                if b.get("date") == date_str and b.get("status") == "confirmed"
            }

            t = start_minutes
            while t + duration <= end_minutes:
                slot_start = f"{t // 60:02d}:{t % 60:02d}"
                slot_end_min = t + duration
                slot_end = f"{slot_end_min // 60:02d}:{slot_end_min % 60:02d}"

                if slot_start not in booked_starts:
                    available.append({
                        "date": date_str,
                        "startTime": slot_start,
                        "endTime": slot_end,
                    })

                t += duration
                if len(available) >= 10:
                    break

            if len(available) >= 10:
                break

        return respond(200, {"slots": available})

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
