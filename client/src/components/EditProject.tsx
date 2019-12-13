import React from 'react'
import { History } from "history";
import update from 'immutability-helper'
import { Form, Button, Input, Grid, Loader, Icon, Divider, Checkbox, Image } from 'semantic-ui-react';

import Auth from '../auth/Auth'
import { Task } from '../types/Task'
import { createTask, deleteTask, getTasks, patchTask } from '../api/tasks-api'

interface EditProjectProps {
  match: {
    params: {
      projectId: string
    }
  }
  auth: Auth;
  history: History;
}

interface EditProjectState {
  tasks: Task[];
  newTaskName: string;
  newDueDate: string;
  loadingTasks: boolean;
}

export class EditProject extends React.PureComponent<EditProjectProps, EditProjectState> {
  state: EditProjectState = {
    tasks: [],
    newTaskName: "",
    newDueDate: "",
    loadingTasks: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTaskName: event.target.value });
  };

  handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDueDate: event.target.value });
  };

  onEditButtonClick = (projectId: string, taskId: string) => {
    this.props.history.push(`/projects/${projectId}/tasks/${taskId}/edit`)
  }

  onTaskCreate = async () => {
    try {
      const newTask = await createTask(this.props.auth.getIdToken(),
        this.props.match.params.projectId,
        {
          name: this.state.newTaskName,
          dueDate: this.state.newDueDate
        });

      this.setState({
        tasks: [...this.state.tasks, newTask],
        newTaskName: "",
        newDueDate: ""
      });
    } catch {
      alert("Task creation failed");
    }
  };

  onTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(this.props.auth.getIdToken(), this.props.match.params.projectId, taskId);
      this.setState({
        tasks: this.state.tasks.filter(
          task => task.taskId !== taskId
        )
      });
    } catch {
      alert("Task deletion failed");
    }
  };

  onTaskCheck = async (pos: number) => {
    try {
      const task = this.state.tasks[pos]
      await patchTask(this.props.auth.getIdToken(), task.projectId, task.taskId, {
        name: task.name,
        dueDate: task.dueDate,
        done: !task.done
      })
      this.setState({
        tasks: update(this.state.tasks, {
          [pos]: { done: { $set: !task.done } }
        })
      })
    } catch {
      alert('Task status change failed')
    }
  }

  async componentDidMount() {
    try {
      const tasks = await getTasks(this.props.auth.getIdToken(), this.props.match.params.projectId);
      this.setState({
        tasks,
        loadingTasks: false
      });
    } catch (e) {
      alert(`Failed to fetch tasks: ${e.message}`);
    }
  }

  render() {
    return (
      <div>
        <h1>Tasks</h1>

        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              {this.renderCreateTaskInput()}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              {this.renderTasks()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
    </div>
    )
  }

  renderCreateTaskInput() {
    return (
      <Form>
        <Form.Group widths="equal">
          <Form.Field required>
            <label>Name</label>
            <Input fluid placeholder="Task name" onChange={this.handleNameChange} />
          </Form.Field>
          <Form.Field required>
            <label>Due Date</label>
            <Input fluid placeholder="Task Due Date" onChange={this.handleDueDateChange} />
          </Form.Field>
        </Form.Group>
        <Form.Field control={Button} onClick={this.onTaskCreate}>Add Task</Form.Field>
      </Form>
    );
  }

  renderTasks() {
    if (this.state.loadingTasks) {
      return this.renderLoading();
    }

    return this.renderTasksList();
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Tasks
        </Loader>
      </Grid.Row>
    );
  }

  renderTasksList() {
    return (
      <Grid padded>
        {this.state.tasks.map((task, pos) => {
          return (
            <Grid.Row key={task.taskId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTaskCheck(pos)}
                  checked={task.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {task.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {task.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button icon color="blue" onClick={() => this.onEditButtonClick(task.projectId, task.taskId)}>
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button icon color="red" onClick={() => this.onTaskDelete(task.taskId)}>
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {task.attachmentUrl && (
                <Image src={task.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          );
        })}
      </Grid>
    );
  }
}
