import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getAllTasksByProject } from "../../../businessLogic/tasks";
import { projectExists } from "../../../businessLogic/projects";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Getting all tasks", event);

    const projectId = event.pathParameters.projectId;

    const validProjectId = await projectExists(projectId);
    if (!!validProjectId) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Project with id ${projectId} not found`
        })
      };
    }

    const tasks = await getAllTasksByProject(projectId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: tasks
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
