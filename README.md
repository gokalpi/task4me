# Cloud Capstone Project


# How to run the application

## Backend

To deploy this serverless application, run the following commands:

```
cd backend
npm install
sls deploy -v
```
This is the example page screenshot of deploy result

![Alt text](images/deploy_success.PNG?raw=true "deploy_success")

## Frontend

To run the React client application first edit the `client/src/config.ts` file to set correct api and auth0 parameters. And then run the following commands:

```
cd client
npm install
npm start
```

This starts a development server with the React application that will interact with the serverless application.