import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getTaskById } from "../../../businessLogic/tasks";
import { projectExists } from "../../../businessLogic/projects";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Getting task", event);
    const projectId = event.pathParameters.projectId;
    const taskId = event.pathParameters.taskId;

    const task = await getTaskById(projectId, taskId);

    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Task of project ${projectId} with id ${taskId} not found`
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
