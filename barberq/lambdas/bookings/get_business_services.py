import json
import os
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["SERVICES_TABLE"])
ALLOWED_ORIGIN = os.environ["ALLOWED_ORIGIN"]


def handler(event, context):
    try:
        business_id = (event.get("pathParameters") or {}).get("businessId")
        if not business_id:
            return respond(400, {"message": "Missing businessId."})

        result = table.query(
            KeyConditionExpression=Key("businessId").eq(business_id)
        )

        services = [
            {
                "serviceId": item["serviceId"],
                "name": item["name"],
                "price": float(item["price"]),
                "durationMinutes": int(item["durationMinutes"]),
            }
            for item in result.get("Items", [])
        ]

        return respond(200, {"services": services})

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
