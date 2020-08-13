# Task Manager

## Run REST API - rest-api

First you need to install mongodb and create a collection named `task_manager`

Then, access to rest-api folder:

```
cd rest-api
```

Install all dependencies:

```
npm install
```

Before run the rest api, you need to configure local variables, then create if not exists a .env file with the following content:

```
PORT=3000
DATABASE_URL=mongodb://localhost:27017/task_manager
```

In the end, run the following command:

```
npm start
```

## Run Web App - web-app

Access to web-app folder:

```
cd web-app
```

Install all dependencies:

```
npm install
```

In the end, run the following command:

```
npm start
```