import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { UpdateProjectRequest } from "../../../requests/UpdateProjectRequest";
import { updateProject } from "../../../businessLogic/projects";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const projectId = event.pathParameters.projectId;
    const updatedProject: UpdateProjectRequest = JSON.parse(event.body);

    await updateProject(updatedProject, projectId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Project with id ${projectId} updated`
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
