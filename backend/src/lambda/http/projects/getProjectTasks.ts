import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getAllUserTasksByProject } from "../../../businessLogic/tasks";
import { projectExists } from "../../../businessLogic/projects";
import { getUserId } from "../../../auth/utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Getting all tasks of current user in a project", event);

    const projectId = event.pathParameters.projectId;
    const userId = getUserId(event);

    const validProject = await projectExists(projectId);
    if (!validProject) {
      console.log(`Project with id ${projectId} not found`)

      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Project with id ${projectId} not found`
        })
      };
    }
    
    const tasks = await getAllUserTasksByProject(userId, projectId);

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
