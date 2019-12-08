import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { CreateProjectRequest } from "../../../requests/CreateProjectRequest";
import { createProject } from "../../../businessLogic/projects";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Creating todo", event);

    const newProject: CreateProjectRequest = JSON.parse(event.body);
    const newItem = await createProject(newProject);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
