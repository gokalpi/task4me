import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { Task } from "../models/Task";
import { TaskUpdate } from "../models/TaskUpdate";
import { createDynamoDBClient } from "../utils/aws-wrapped";

export class TaskAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly tasksTable = process.env.TASKS_TABLE
  ) { }

  async getTaskById(taskId: string): Promise<Task> {
    console.log(`Getting task with id ${taskId}`);

    var params = {
      TableName: this.tasksTable,
      Key: {
        taskId
      }
    };

    const result = await this.docClient.get(params).promise();

    return result.Item as Task;
  }

  async getAllUserTasksByProject(userId: string, projectId: string): Promise<Task[]> {
    console.log(`Getting all tasks of project ${projectId}`);

    var params = {
      TableName: this.tasksTable,
      IndexName: process.env.TASK_USERID_PROJECTID_INDEX,
      KeyConditionExpression: "userId = :userId AND projectId = :projectId",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":projectId": projectId        
      },
      ScanIndexForward: false
    };

    const result = await this.docClient.query(params).promise();

    return result.Items as Task[];
  }

  async createTask(task: Task) {
    console.log(`Creating a task with id ${task.taskId}`);

    var params = {
      TableName: this.tasksTable,
      Item: task
    };

    await this.docClient
      .put(params, function (err, data) {
        if (err) {
          console.error("Unable to create task. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("Create task succeeded:", JSON.stringify(data, null, 2));
        }
      })
      .promise();
  }

  async updateTask(
    taskId: string,
    userId: string,
    task: TaskUpdate
  ) {
    console.log(`Updating task with id ${taskId}`);

    var params = {
      TableName: this.tasksTable,
      Key: {
        taskId
      },
      UpdateExpression: "SET #name = :name, dueDate = :dueDate, done = :done, modifiedAt = :modifiedAt, modifiedBy = :modifiedBy",
      ExpressionAttributeValues: {
        ":name": task.name,
        ":dueDate": task.dueDate,
        ":done": task.done,
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
          console.error("Unable to update task. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("Update task succeeded:", JSON.stringify(data, null, 2));
        }
      })
      .promise();
  }

  async deleteTask(taskId: string) {
    console.log(`Deleting task with id ${taskId}`);

    var params = {
      TableName: this.tasksTable,
      Key: {
        taskId
      }
    };

    await this.docClient
      .delete(params, function (err, data) {
        if (err) {
          console.error("Unable to delete task. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("Delete task succeeded:", JSON.stringify(data, null, 2));
        }
      })
      .promise();
  }

  async taskExists(taskId: string) {
    console.log(`Checking if task with id ${taskId} exists`);

    var params = {
      TableName: this.tasksTable,
      Key: {
        taskId
      }
    };

    const result = await this.docClient.get(params).promise();

    console.log("taskExists", result);
    return !!result.Item;
  }
  
  async updateAttachmentUrl(taskId: string, attachmentUrl: string) {
    console.log(`Updating attachment URL of task with id ${taskId}`)

    var params = {
      TableName: this.tasksTable,
      Key: {
        taskId
      },
      UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }

    await this.docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update attachment Url. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("updateAttachmentUrl succeeded:", JSON.stringify(data, null, 2));
        }
    }).promise()
  }
}
