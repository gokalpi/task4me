import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { CreateTaskRequest } from "../../../requests/CreateTaskRequest";
import { createTask } from "../../../businessLogic/tasks";
import { projectExists } from "../../../businessLogic/projects";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Creating task", event);

    const newTask: CreateTaskRequest = JSON.parse(event.body);

    const validProjectId = await projectExists(newTask.projectId);
    if (!!validProjectId) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Project with id  ${newTask.projectId} not found`
        })
      };
    }

    const newItem = await createTask(newTask);

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
