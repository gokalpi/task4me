import { DocumentClient } from "aws-sdk/clients/dynamodb";

export function createDynamoDBClient(): DocumentClient {
  const AWS = require('aws-sdk');
  const AWSXRay = require('aws-xray-sdk-core');

  const awsWrapped = AWSXRay.captureAWS(AWS);

  if (process.env.IS_LOCAL) {
    console.log("Creating a local DynamoDB instance");
    return new AWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    });
  }

  return new awsWrapped.DynamoDB.DocumentClient();
}
