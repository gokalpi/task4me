import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { CreateTaskRequest } from "../../../requests/CreateTaskRequest";
import { createTask } from "../../../businessLogic/tasks";
import { projectExists } from "../../../businessLogic/projects";
import { getUserId } from "../../../auth/utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Creating task", event);

    const userId = getUserId(event);
    const projectId = event.pathParameters.projectId;

    const validProjectId = await projectExists(projectId);
    if (!validProjectId) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Project with id ${projectId} not found`
        })
      };
    }

    const newTask: CreateTaskRequest = JSON.parse(event.body);

    const newItem = await createTask(newTask, projectId, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
