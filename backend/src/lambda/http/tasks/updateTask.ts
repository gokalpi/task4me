import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { UpdateTaskRequest } from "../../../requests/UpdateTaskRequest";
import { updateTask, taskExists } from "../../../businessLogic/tasks";
import { projectExists } from "../../../businessLogic/projects";
import { getUserId } from "../../../auth/utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Updating task", event);

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

    const taskId = event.pathParameters.taskId;
    const validTaskId = await taskExists(projectId, taskId);
    if (!validTaskId) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Task of ${projectId} with id ${taskId} not found`
        })
      };
    }

    const updatedTask: UpdateTaskRequest = JSON.parse(event.body);
    await updateTask(updatedTask, projectId, taskId, userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Task of ${projectId} with id ${taskId} updated`
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
