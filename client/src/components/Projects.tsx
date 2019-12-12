import dateFormat from "dateformat";
import { History } from "history";
import React from "react";
import { Button, Form, Grid, Header, Icon, Input, Loader, Card } from "semantic-ui-react";

import { createProject, deleteProject, getProjects } from "../api/projects-api";
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

  onProjectCreate = async () => {
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

        <Grid>
          <Grid.Row key="project-input">
            <Grid.Column width={16}>
              {this.renderNewProjectInput()}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row key="project-list">
            <Grid.Column width={16}>
              {this.renderProjects()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }

  renderNewProjectInput() {
    return (
      <Form>
        <Form.Group widths="equal">
          <Form.Field required>
            <label>Name</label>
            <Input fluid placeholder="Project name" onChange={this.handleNameChange} />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <Input fluid placeholder="Project Description" onChange={this.handleDescriptionChange} />
          </Form.Field>
        </Form.Group>
        <Form.Field control={Button} onClick={this.onProjectCreate}>Add Project</Form.Field>
      </Form>
    );
  }

  renderProjects() {
    if (this.state.loadingProjects) {
      return this.renderLoading();
    }

    return this.renderProjectCards();
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
  
  renderProjectCards() {
    return (
      <Card.Group>
        {this.state.projects.map((project) => {
          return (
            <Card key={project.id}>
              <Card.Content>
                <Card.Header>{project.name}</Card.Header>
                <Card.Meta>
                  <span className="date">
                    <i className="calendar icon"></i>Created:{" "}
                    {this.formatDate(project.createdAt)}
                  </span>
                  <span className="right floated date">
                    <i className="history icon"></i> Modified:{" "}
                    {this.formatDate(project.modifiedAt)}
                  </span>
                </Card.Meta>
                <Card.Description>{project.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui two buttons">
                  <Button icon color="blue" onClick={() => this.onEditButtonClick(project.id)}>
                    <Icon name="pencil" /> Edit
                  </Button>
                  <Button icon color="red" onClick={() => this.onProjectDelete(project.id)}>
                    <Icon name="delete" /> Delete
                  </Button>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    );
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'No';

    const date = Date.parse(dateString);
    return dateFormat(date, "yyyy-mm-dd") as string;
  }
}
