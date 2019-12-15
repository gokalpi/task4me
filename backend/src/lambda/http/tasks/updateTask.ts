import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { UpdateTaskRequest } from "../../../requests/UpdateTaskRequest";
import { updateTask, taskExists } from "../../../businessLogic/tasks";
import { getUserId } from "../../../auth/utils";
import { projectExists } from "../../../businessLogic/projects";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Updating task", event);

    const updatedTask: UpdateTaskRequest = JSON.parse(event.body);
    const userId = getUserId(event);

    const validProjectId = await projectExists(updatedTask.projectId);
    if (!validProjectId) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Project with id ${updatedTask.projectId} not found`
        })
      };
    }

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

    await updateTask(updatedTask, taskId, userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Task with id ${taskId} updated`
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
