import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { Project } from "../models/Project";
import { ProjectUpdate } from "../models/ProjectUpdate";
import { createDynamoDBClient } from "../utils/aws-wrapped";

export class ProjectAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly projectsTable = process.env.PROJECTS_TABLE
  ) {}

  async getProjectById(projectId: string): Promise<Project> {
    console.log(`Getting project with id ${projectId}`);

    var params = {
      TableName: this.projectsTable,
      Key: {
        projectId
      }
    };

    const result = await this.docClient.get(params).promise();

    return result.Item as Project;
  }

  async getAllProjectsByUser(userId: string): Promise<Project[]> {
    console.log(`Getting all projects of user ${userId}`);

    var params = {
      TableName: this.projectsTable,
      IndexName: process.env.PROJECT_USERID_INDEX,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      },
      ScanIndexForward: false
    };

    const result = await this.docClient.query(params).promise();

    return result.Items as Project[];
  }

  async createProject(project: Project) {
    console.log("Creating a project", project);

    var params = {
      TableName: this.projectsTable,
      Item: project
    };

    await this.docClient
      .put(params, function (err, data) {
        if (err) {
          console.error("Unable to create project. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("Create project succeeded:", JSON.stringify(data, null, 2));
        }
      })
      .promise();
  }

  async updateProject(
    projectId: string,
    userId: string,
    project: ProjectUpdate
  ) {
    console.log(`Deleting project with id ${projectId}`);

    var params = {
      TableName: this.projectsTable,
      Key: {
        projectId
      },
      UpdateExpression: "SET #name = :name, description = :description, modifiedAt = :modifiedAt, modifiedBy = :modifiedBy",
      ExpressionAttributeValues: {
        ":name": project.name,
        ":description": project.description,
        ":modifiedAt": new Date().toISOString(),
        ":modifiedBy": userId
      },
      ExpressionAttributeNames: {
        "#name": "name"
      }
    };

    await this.docClient
      .update(params, function(err, data) {
        if (err) {
          console.error(
            "Unable to update project. Error JSON:",
            JSON.stringify(err, null, 2)
          );
        } else {
          console.log(
            "Update project succeeded:",
            JSON.stringify(data, null, 2)
          );
        }
      })
      .promise();
  }

  async deleteProject(projectId: string) {
    console.log(`Deleting project with id ${projectId}`);

    var params = {
      TableName: this.projectsTable,
      Key: { projectId }
    };

    await this.docClient
      .delete(params, function(err, data) {
        if (err) {
          console.error(
            "Unable to delete project. Error JSON:",
            JSON.stringify(err, null, 2)
          );
        } else {
          console.log(
            "Delete project succeeded:",
            JSON.stringify(data, null, 2)
          );
        }
      })
      .promise();
  }

  async projectExists(projectId: string) {
    console.log(`Checking if project with id ${projectId} exists`);

    var params = {
      TableName: this.projectsTable,
      Key: { projectId }
    };

    const result = await this.docClient.get(params).promise();

    console.log("Project exists: ", result);
    return !!result.Item;
  }
}
