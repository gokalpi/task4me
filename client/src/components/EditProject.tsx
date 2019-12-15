import React from 'react'
import { History } from "history";
import update from 'immutability-helper'
import { Form, Button, Input, Grid, Loader, Icon, Divider, Checkbox, Image } from 'semantic-ui-react';

import Auth from '../auth/Auth'
import { Task } from '../types/Task'
import { createTask, deleteTask, updateTask } from '../api/tasks-api'
import { getProject, updateProject, getProjectTasks } from '../api/projects-api';

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
  projectId: string,
  project: any;
  newProjectName: string;
  newDescription?: string;
  submitSuccess: boolean;
  tasks: Task[];
  newTaskName: string;
  newDueDate: string;
  loadingTasks: boolean;
}

export class EditProject extends React.PureComponent<EditProjectProps, EditProjectState> {
  state: EditProjectState = {
    projectId: this.props.match.params.projectId,
    project: {},
    newProjectName: "",
    newDescription: "",
    tasks: [],
    newTaskName: "",
    newDueDate: "",
    loadingTasks: true,
    submitSuccess: false
  }

  handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProjectName: event.target.value });
  };

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value });
  };

  handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTaskName: event.target.value });
  };

  handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDueDate: event.target.value });
  };

  onEditButtonClick = (projectId: string, taskId: string) => {
    this.props.history.push(`/projects/${projectId}/tasks/${taskId}/edit`)
  }

  onProjectUpdate = async () => {
    try {
      await updateProject(this.props.auth.getIdToken(),
        this.props.match.params.projectId,
        {
          name: this.state.newProjectName,
          description: this.state.newDescription
        });

      this.setState({
        newProjectName: "",
        newDescription: ""
      });

      alert("Project updated");

    // setTimeout(() => {
    //   this.props.history.push("/");
    // }, 1500);
  } catch {
      alert("Project update failed");
    }
  };

  onTaskCreate = async () => {
    try {
      const newTask = await createTask(this.props.auth.getIdToken(),
        {
          projectId: this.props.match.params.projectId,
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
      await deleteTask(this.props.auth.getIdToken(), taskId);
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
      await updateTask(this.props.auth.getIdToken(), task.taskId, {
        projectId: task.projectId,
        name: task.name,
        dueDate: task.dueDate,
        done: !task.done
      })
      this.setState({
        tasks: update(this.state.tasks, {
          [pos]: { done: { $set: !task.done } }
        })
      })
      alert('Task status changed')
    } catch {
      alert('Task status change failed')
    }
  }

  async componentDidMount() {
    try {
      const idToken = this.props.auth.getIdToken();
      const project = await getProject(idToken, this.state.projectId);
      console.log("Project found", project);
      const tasks = await getProjectTasks(idToken, this.state.projectId);
      this.setState({
        project,
        newProjectName: project.name,
        newDescription: project.description,
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
        <h1>Project</h1>

        {this.renderProjectEditForm()}

        <h1>Tasks</h1>

        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              {this.renderTaskCreateForm()}
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

  renderProjectEditForm() {
    return (
      <Form key="project-edit-form" noValidate={true}>
        <Form.Group widths="equal">
          <Form.Field required>
            <label>Name</label>
            <Input fluid placeholder="Project name" defaultValue={this.state.project.name} onChange={this.handleProjectNameChange} />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <Input fluid placeholder="Project Description" defaultValue={this.state.project.description} onChange={this.handleDescriptionChange} />
          </Form.Field>
        </Form.Group>
        <Form.Field control={Button} onClick={this.onProjectUpdate}>Update Project</Form.Field>
      </Form>
    );
  }

  renderTaskCreateForm() {
    return (
      <Form>
        <Form.Group widths="equal">
          <Form.Field required>
            <label>Name</label>
            <Input fluid placeholder="Task name" onChange={this.handleTaskNameChange} />
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
