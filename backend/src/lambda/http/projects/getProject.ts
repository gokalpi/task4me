import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getProjectById } from "../../../businessLogic/projects";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Getting project", event);
    const projectId = event.pathParameters.projectId;

    console.log(`Getting project ${projectId}`);
    const project = await getProjectById(projectId);

    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Project with id ${projectId} not found`
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: project
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
