import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { Project } from "../models/Project";
import { ProjectUpdate } from "../models/ProjectUpdate";
import { createDynamoDBClient } from "../utils/aws-wrapped";

export class ProjectAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly projectsTable = process.env.PROJECTS_TABLE
  ) { }

  async getProjectById(id: string): Promise<Project> {
    console.log(`Getting project with id ${id}`);

    var params = {
      TableName: this.projectsTable,
      Key: {
        id
      }
    };

    const result = await this.docClient.get(params).promise();

    return result.Item as Project;
  }

  async getAllProjects(): Promise<Project[]> {
    console.log("Getting all projects");

    var params = {
      TableName: this.projectsTable
    };

    const result = await this.docClient.scan(params).promise();
    return result.Items as Project[];
  }

  async createProject(project: Project) {
    console.log(`Creating a project with id ${project.id}`);

    var params = {
      TableName: this.projectsTable,
      Item: project
    };

    await this.docClient
      .put(params, function (err, data) {
        if (err) {
          console.error(
            "Unable to create project. Error JSON:",
            JSON.stringify(err, null, 2)
          );
        } else {
          console.log(
            "Create project succeeded:",
            JSON.stringify(data, null, 2)
          );
        }
      })
      .promise();
  }

  async updateProject(id: string, userId: string, project: ProjectUpdate) {
    console.log(`Updating project with id ${id}`);

    var params = {
      TableName: this.projectsTable,
      Key: {
        id
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
      .update(params, function (err, data) {
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

  async deleteProject(id: string) {
    console.log(`Deleting project with id ${id}`);

    var params = {
      TableName: this.projectsTable,
      Key: {
        id
      }
    };

    await this.docClient
      .delete(params, function (err, data) {
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

  async projectExists(id: string) {
    console.log(`Checking if project with id ${id} exists`);

    var params = {
      TableName: this.projectsTable,
      Key: {
        id
      }
    };

    const result = await this.docClient.get(params).promise();

    console.log("Get project: ", result);
    return !!result.Item;
  }
}
