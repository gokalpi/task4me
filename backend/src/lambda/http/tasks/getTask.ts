import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getTaskById } from "../../../businessLogic/tasks";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Getting task", event);
    const taskId = event.pathParameters.taskId;

    const task = await getTaskById(taskId);

    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Task with id ${taskId} not found`
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: task
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
