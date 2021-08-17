# word-counter-backend

This rest API application that stores the assignments and exercises.

The  application was build with Express Js framework.

on MariaDB.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the  [http://localhost:5000](http://localhost:5000) by default, you can update the environment variable `PORT` to use a different port.
`server.js` is the root script, please review `package.json` to get more information.

### `npm run dev`

Internally, the script `server.js` is started by `nodemon`so the server will be updated on save of new changes.

## Schema details
Please visit [schema.sql](https://github.com/adrianchavez123/word-counter-backend/blob/main/db/schema.sql) to get more details about the database and its tables.
MariaDB is the RDBM used so far but it may be updated to support different RDBMs.

## Available Routes and their responses

### `Profesor`

| End Point        | Verb           | Params  |
| ------------- |:-------------:| -----:|
| api/professors/`<id>`   | GET |  |
| api/professors/     | POST      |    |
| api/professors/`<id>`| PUT    |     |
| api/professors/`<id>`| DELETE    |     |

**create a professor**
Endpoint:
api/professors/

Verb:
POST

Request:
```json
{
    "username": "String",
    "name": "String",
    "email": "String",
    "password": "String"
  }
```

Response:
```json
{
  "message": "Professor created successfully",
  "professor": {
    "username": "String",
    "name": "String",
    "email": "String"
  }
}
```

**view a professor's data**
Endpoint:
api/professors/`<id>`

Verb:
GET

Response:
```json
{
  "professor_id": 2,
  "name": "String",
  "username": "String",
  "groups": [],
  "exercises": []
}
```

**Modify a professor**
Endpoint:
api/professors`<id>`

Verb:
PUT

Request:
```json
{
    "username": "String",
    "name": "String",
    "email": "String",
  }
```

Response:
```json
{
  "message": "Update successful!"
}
```

**Delete a professor**
Endpoint:
api/professors`<id>`

Verb:
DELETE

Response:
```json
{
  "message": "Professor deleted!"
}
```
