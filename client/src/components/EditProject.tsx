import React from 'react'
import { History } from "history";
import { Form, Button, Input, Grid, Loader, Icon, Divider } from 'semantic-ui-react';

import Auth from '../auth/Auth'
import { Task } from '../types/Task'
import { createTask, deleteTask, getTasks } from '../api/tasks-api'

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
        {this.state.tasks.map((task) => {
          return (
            <Grid.Row key={task.taskId}>
              <Grid.Column width={10} verticalAlign="middle">
                {task.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {task.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTaskDelete(task.taskId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
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
