import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { Task } from "../models/Task";
import { TaskUpdate } from "../models/TaskUpdate";
import { createDynamoDBClient } from "../utils/aws-wrapped";

export class TaskAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly tasksTable = process.env.TASKS_TABLE
  ) {}

  async getTaskById(projectId: string, taskId: string): Promise<Task> {
    console.log(`Getting task of project ${projectId} with id ${taskId}`);

    var params = {
      TableName: this.tasksTable,
      Key: {
        projectId,
        taskId
      }
    };

    const result = await this.docClient.get(params).promise();

    return result.Item as Task;
  }

  async getAllTasksByProject(projectId: string): Promise<Task[]> {
    console.log(`Getting all tasks of project ${projectId}`);

    var params = {
      TableName: this.tasksTable,
      KeyConditionExpression: "projectId = :projectId",
      ExpressionAttributeValues: {
        ":projectId": projectId
      },
      ScanIndexForward: false
    };

    const result = await this.docClient.query(params).promise();

    return result.Items as Task[];
  }

  async createTask(task: Task) {
    console.log(`Creating a task of project ${task.projectId} with id ${task.taskId}`);

    var params = {
      TableName: this.tasksTable,
      Item: task
    };

    await this.docClient
      .put(params, function(err, data) {
        if (err) {
          console.error(
            "Unable to create task. Error JSON:",
            JSON.stringify(err, null, 2)
          );
        } else {
          console.log("Create task succeeded:", JSON.stringify(data, null, 2));
        }
      })
      .promise();
  }

  async updateTask(projectId: string, taskId: string, task: TaskUpdate) {
    console.log(`Updating task of project ${projectId} with id ${taskId}`);

    var params = {
      TableName: this.tasksTable,
      Key: {
        projectId,
        taskId
      },
      UpdateExpression: "SET #name = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeValues: {
        ":name": task.name,
        ":dueDate": task.dueDate,
        ":done": task.done
      },
      ExpressionAttributeNames: {
        "#name": "name"
      }
    };

    await this.docClient
      .update(params, function(err, data) {
        if (err) {
          console.error(
            "Unable to update task. Error JSON:",
            JSON.stringify(err, null, 2)
          );
        } else {
          console.log("Update task succeeded:", JSON.stringify(data, null, 2));
        }
      })
      .promise();
  }

  async deleteTask(projectId: string, taskId: string) {
    console.log(`Deleting task of project ${projectId} with id ${taskId}`);

    var params = {
      TableName: this.tasksTable,
      Key: {
        projectId,
        taskId
      }
    };

    await this.docClient
      .delete(params, function(err, data) {
        if (err) {
          console.error(
            "Unable to delete task. Error JSON:",
            JSON.stringify(err, null, 2)
          );
        } else {
          console.log("Delete task succeeded:", JSON.stringify(data, null, 2));
        }
      })
      .promise();
  }

  async taskExists(projectId: string, taskId: string) {
    console.log(
      `Checking if task of project ${projectId} with id ${taskId} exists`
    );

    var params = {
      TableName: this.tasksTable,
      Key: {
        projectId,
        taskId
      }
    };

    const result = await this.docClient.get(params).promise();

    console.log("Get task: ", result);
    return !!result.Item;
  }
}
