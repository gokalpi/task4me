import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { deleteProject } from "../../../businessLogic/projects";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const projectId = event.pathParameters.projectId;

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
