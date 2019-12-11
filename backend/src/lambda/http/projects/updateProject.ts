import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { UpdateProjectRequest } from "../../../requests/UpdateProjectRequest";
import { updateProject, projectExists } from "../../../businessLogic/projects";
import { getUserId } from "../../../auth/utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Updating project", event);

    const projectId = event.pathParameters.projectId;
    const updatedProject: UpdateProjectRequest = JSON.parse(event.body);
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

    await updateProject(updatedProject, projectId, userId);

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
