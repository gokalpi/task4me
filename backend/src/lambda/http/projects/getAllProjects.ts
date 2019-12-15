import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getAllProjectsByUser } from "../../../businessLogic/projects";
import { getUserId } from "../../../auth/utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Getting all projects", event);

    const userId = getUserId(event);
    const projects = await getAllProjectsByUser(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: projects
      })
    };
  }
);

handler.use(
  cors({
    credentials: true
  })
);
