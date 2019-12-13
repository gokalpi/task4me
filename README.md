# Udacity Cloud Developer Capstone Project

I have developed a project task management application. This repository has both serverless backend codes and React client typescript codes.

# How to run the application

## Backend

To deploy this serverless application, run the following commands:

```
cd backend
npm install
sls deploy -v
```
This is the example page screenshot of deploy result

![](/images/serverless-deploy.jpg?raw=true "Serverless deployment result")

## Frontend

To run the React client application first edit the `client/src/config.ts` file to set correct api and auth0 parameters. And then run the following commands:

```
cd client
npm install
npm start
```

This starts a development server with the React application that will interact with the serverless application.

![](/images/homepage.jpg?raw=true "Homepage of React client")

If you click on Login button, Auth0 integration is triggered and Auth0 login screen pops up.
![](/images/autho-login.jpg?raw=true "Auth0 login page")

After you login successfully, projects are listed by using serverless lambda functions.
![](/images/projects.jpg?raw=true "Projects")

If you edit one of the projects, you can manage the tasks of this project and upload files to tasks.
![](/images/tasks-in-a-project.jpg.jpg?raw=true "Projects")
