import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { generateAttachmentUrl, taskExists } from "../../../businessLogic/tasks";
import { projectExists } from "../../../businessLogic/projects";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Generating Upload URL for task", event);

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
    
    // Return a presigned URL to upload a file for a TODO item with the provided id
    const uploadUrl = await generateAttachmentUrl(projectId, taskId);

    console.log('uploadUrl', uploadUrl)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
