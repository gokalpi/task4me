import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { deleteTask, taskExists } from "../../../businessLogic/tasks";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const taskId = event.pathParameters.taskId;

    const validTaskId = await taskExists(taskId);
    if (!validTaskId) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Task with id ${taskId} not found`
        })
      };
    }

    await deleteTask(taskId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Task with id ${taskId} deleted`
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
