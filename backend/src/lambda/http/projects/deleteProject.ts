import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { deleteProject, getProjectById } from "../../../businessLogic/projects";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const projectId = event.pathParameters.projectId;

    const project = await getProjectById(projectId);
    if (!project) {
      console.log(`Project with id ${projectId} not found`)

      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Project with id ${projectId} not found`
        })
      };
    }

    await deleteProject(projectId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Project with id ${projectId} deleted`
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
