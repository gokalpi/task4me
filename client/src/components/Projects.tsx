import dateFormat from "dateformat";
import { History } from "history";
import * as React from "react";
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Loader
} from "semantic-ui-react";

import {
  createProject,
  deleteProject,
  getProjects
} from "../api/projects-api";
import Auth from "../auth/Auth";
import { Project } from "../types/Project";

interface ProjectsProps {
  auth: Auth;
  history: History;
}

interface ProjectsState {
  projects: Project[];
  newProjectName: string;
  newDescription: string;
  loadingProjects: boolean;
}

export class Projects extends React.PureComponent<
  ProjectsProps,
  ProjectsState
> {
  state: ProjectsState = {
    projects: [],
    newProjectName: "",
    newDescription: "",
    loadingProjects: true
  };

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProjectName: event.target.value });
  };

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value });
  };

  onEditButtonClick = (projectId: string) => {
    this.props.history.push(`/projects/${projectId}/edit`);
  };

  onProjectCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newProject = await createProject(this.props.auth.getIdToken(), {
        name: this.state.newProjectName,
        description: this.state.newDescription
      });
      this.setState({
        projects: [...this.state.projects, newProject],
        newProjectName: "",
        newDescription: ""
      });
    } catch {
      alert("Project creation failed");
    }
  };

  onProjectDelete = async (projectId: string) => {
    try {
      await deleteProject(this.props.auth.getIdToken(), projectId);
      this.setState({
        projects: this.state.projects.filter(
          project => project.id !== projectId
        )
      });
    } catch {
      alert("Project deletion failed");
    }
  };

  async componentDidMount() {
    try {
      const projects = await getProjects(this.props.auth.getIdToken());
      this.setState({
        projects,
        loadingProjects: false
      });
    } catch (e) {
      alert(`Failed to fetch projects: ${e.message}`);
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">PROJECTS</Header>

        {this.renderCreateProjectInput()}

        {this.renderProjects()}
      </div>
    );
  }

  renderCreateProjectInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: "teal",
              labelPosition: "left",
              icon: "add",
              content: "New task",
              onClick: this.onProjectCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Input
            action={{
              color: "teal",
              labelPosition: "left",
              icon: "add",
              content: "New task description",
              onClick: this.onProjectCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Description"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    );
  }

  renderProjects() {
    if (this.state.loadingProjects) {
      return this.renderLoading();
    }

    return this.renderProjectsList();
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Projects
        </Loader>
      </Grid.Row>
    );
  }

  renderProjectsList() {
    return (
      <Grid padded>
        {this.state.projects.map((project, pos) => {
          return (
            <Grid.Row key={project.id}>
              <Grid.Column width={10} verticalAlign="middle">
                {project.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {project.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(project.id)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onProjectDelete(project.id)}
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

  calculateDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);

    return dateFormat(date, "yyyy-mm-dd") as string;
  }
}
