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
api/professors/`<id>`

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
api/professors/`<id>`

Verb:
DELETE

Response:
```json
{
  "message": "Professor deleted!"
}
```

### `Student`

| End Point        | Verb           | Params  |
| ------------- |:-------------:| -----:|
| api/students/ | GET | professor_id=`<id>` |
| api/students/`<id>`   | GET |  |
| api/students/     | POST      |    |
| api/students/`<id>`| PUT    |     |
| api/students/`<id>`| DELETE    |     |

**view the students**
Endpoint:
api/students/

Verb:
GET

Request params:
```
?professor_id=<id>
```

Response:
```json
[
  {
    "student_id": 1,
    "username": "pedro",
    "groups": [
      {
        "group_name": "group",
        "group_id": 1
      }
    ]
  },
]
```

**view students' data**
Endpoint:
api/students/`<id>`

Verb:
GET

Response:
```json
{
  "student_id": 1,
  "username": "pedro",
  "groups": [
    {
      "group_name": "group",
      "group_id": 1
    }
  ],
  "assignments": [
    {
      "title": "leer el cuento más contado",
      "exercise_id": 1,
      "words_amount": 150
    },
    {
      "title": "leer ejercicio pagina 189",
      "exercise_id": 2,
      "words_amount": 161
    }
  ]
}
```

**create a student**
Endpoint:
api/students/

Verb:
POST

Request:
```json
{
    "username": "String",
    "student_id": "int"
}
```

Response:
```json
{
  "message": "Student created successfully",
  "student": {
    "username": "adrian",
    "student_id": 4545
  }
}
```


**Modify a student**
Endpoint:
api/students/`<id>`

Verb:
PUT

Request:
```json
{
    "username": "String",
}
```

Response:
```json
{
  "message": "Update successful!"
}
```

**Delete a student**
Endpoint:
api/students/`<id>`

Verb:
DELETE

Response:
```json
{
  "message": "Student deleted!"
}
```

### `Group`

| End Point        | Verb           | Params  |
| ------------- |:-------------:| -----:|
| api/groups/ | GET | professor_id=`<id>` |
| api/groups/`<id>`   | GET |  |
| api/groups/     | POST      |    |
| api/groups/`<id>`| PUT    |     |
| api/groups/`<id>`| DELETE    |     |

**view the groups**
Endpoint:
api/groups/

Verb:
GET

Request params:
```
?professor_id=<id>
```

Response:
```json
{
  "groups": [
    {
      "group_id": 1,
      "name": "group",
      "students": [
        {
          "student_id": 1,
          "username": "pedro"
        },
        {
          "student_id": 2,
          "username": "luis"
        },
        {
          "student_id": 3,
          "username": "maria"
        },
        {
          "student_id": 4,
          "username": "laura"
        },
        {
          "student_id": 5,
          "username": "ramon"
        },
        {
          "student_id": 6,
          "username": "alberto"
        },
        {
          "student_id": 7,
          "username": "javier"
        }
      ]
    }
  ]
}
```

**view groups' data**
Endpoint:
api/groups/`<id>`

Verb:
GET

Response:
```json
{
  "group_id": 1,
  "name": "group",
  "students": [
    {
      "student_id": 1,
      "username": "pedro"
    },
    {
      "student_id": 2,
      "username": "luis"
    },
    {
      "student_id": 3,
      "username": "maria"
    },
    {
      "student_id": 4,
      "username": "laura"
    },
    {
      "student_id": 5,
      "username": "ramon"
    },
    {
      "student_id": 6,
      "username": "alberto"
    },
    {
      "student_id": 7,
      "username": "javier"
    }
  ]
}
```

**create a group**
Endpoint:
api/groups/

Verb:
POST

Request:
```json
{
 "professor_id": "int",
    "name": "String",
    "students": ["array with students ids(optional)"]
  }
```

Response:
```json
{
  "message": "Group created successfully",
  "group": {
    "group_id": 4
  }
}
```


**Modify a group**
Endpoint:
api/students/`<id>`

Verb:
PUT

Request:
```json
{
    "professor_id": "int",
    "name": "String",

  }
```

Response:
```json
{
  "message": "Update successful!"
}
```

**Delete a group**
Endpoint:
api/groups/`<id>`

Verb:
DELETE

Response:
```json
{
  "message": "Group deleted!"
}
```



### `Exercise`

| End Point        | Verb           | Params  |
| ------------- |:-------------:| -----:|
| api/exercises/ | GET | professor_id=`<id>` |
| api/exercises/`<id>`   | GET |  |
| api/exercises/     | POST      |    |
| api/exercises/`<id>`| PUT    |     |
| api/exercises/`<id>`| DELETE    |     |

**view exercises**
Endpoint:
api/groups/

Verb:
GET

Request params:
```
?professor_id=<id>
```

Response:
```json
[
  {
    "exercise_id": 1,
    "title": "leer el cuento más contado",
    "description": "descripcion",
    "words_amount": 150,
    "professor_id": 1
  },
  {
    "exercise_id": 2,
    "title": "leer ejercicio pagina 189",
    "description": "descripcion",
    "words_amount": 161,
    "professor_id": 1
  },
]
```

**view exercise's data**
Endpoint:
api/exercises/`<id>`

Verb:
GET

Response:
```json
[
  {
    "exercise_id": 1,
    "title": "leer el cuento más contado",
    "description": "descripcion",
    "words_amount": 150,
    "professor_id": 1
  }
]
```

**create an exercise**
Endpoint:
api/exercises/

Verb:
POST

Request:
```json
{
    "title": "String",
    "description": "String",
    "words_amount": "int",
    "professor_id": "int"
}
```

Response:
```json
{
  "message": "Exercise added successfully",
  "exercise": {
    "title": "String",
    "description": "String",
    "words_amount": 2,
    "professor_id": 1,
    "exercise_id": 16
  }
}
```


**Modify an exercise**
Endpoint:
api/exercises/`<id>`

Verb:
PUT

Request:
```json
{
    "title": "String",
    "description": "String",
    "words_amount": "int",
}
```

Response:
```json
{
  "message": "Update successful!"
}
```

**Delete an exercise**
Endpoint:
api/exercises/`<id>`

Verb:
DELETE

Response:
```json
{
  "message": "Exercise deleted!"
}
```



### `Assignment`

| End Point        | Verb           | Params  |
| ------------- |:-------------:| -----:|
| api/assignments/ | GET | professor_id=`<id>` |
| api/assignments/`<id>`   | GET |  |
| api/assignments/     | POST      |    |
| api/assignments/`<id>`| PUT    |     |
| api/assignments/`<id>`| DELETE    |     |

**view assignments**
Endpoint:
api/assignments/

Verb:
GET

Request params:
```
?professor_id=<id>
```

Response:
```json
[
  {
    "assignment_id": 41,
    "create_at": "2021-08-06T05:00:00.000Z",
    "due_date": "2021-08-13T05:00:00.000Z",
    "group": {
      "group_id": 1,
      "group_name": "group"
    },
    "exercise": {
      "exercise_id": 12,
      "title": "hola"
    }
  }
]
```

**view assignment's data**
Endpoint:
api/assigments/`<id>`

Verb:
GET

Response:
```json
[
  {
    "assignment_id": 45,
    "create_at": "2021-08-06T05:00:00.000Z",
    "due_date": "2021-08-01T05:00:00.000Z",
    "group": {
      "group_id": 2,
      "group_name": "group segundo A"
    },
    "exercise": {
      "exercise_id": 4,
      "title": "leer ejercion de la pagina 199"
    }
  }
]
```

**create an assignment**
Endpoint:
api/assignments/

Verb:
POST

Request:
```json
{
    "due_date": "String (date)",
    "exercise_id": "int",
    "group_id": "int"
}
```

Response:
```json
{
  "message": "Assignment created successfully",
  "assignment": {
    "due_date": "2021-08-17",
    "exercise_id": 1,
    "create_at": "2021-08-17T13:16:06.102Z",
    "group_id": 1,
    "assignment_id": 47,
    "exercise_name": "String2",
    "group_name": "group"
  }
}
```


**Modify an assignment**
Endpoint:
api/assignments/`<id>`

Verb:
PUT

Request:
```json
{
    "due_date": "String (date)",
    "exercise_id": "int",
    "group_id": "int"
}
```


Response:
```json
{
  "message": "Update successful!"
}
```

**Delete an assignment**
Endpoint:
api/assignments/`<id>`

Verb:
DELETE

Response:
```json
{
  "message": "Assignment deleted!"
}
```


### `Deliver Assignment`

| End Point        | Verb           | Params  |
| ------------- |:-------------:| -----:|
| api/deliver-assignments/ | GET | professor_id=`<id>` |
| api/deliver-assignments/`<id>`   | GET |  |
| api/deliver-assignments/     | POST      |    |
| api/deliver-assignments/`<id>`| PUT    |     |
| api/deliver-assignments/`<id>`| DELETE    |     |

**view deliver assignments**
Endpoint:
api/deliver-assignments/

Verb:
GET

Request params:
```
?professor_id=<id>
```

Response:
```json
[
  {
    "deliver_assignment_id": 1,
    "arrive_at": "2021-08-02T05:00:00.000Z",
    "audio_URL": "",
    "total_words_detected": 100,
    "assignment": {
      "assignment_id": 1,
      "due_date": "2021-08-03T05:00:00.000Z"
    },
    "exercise": {
      "exercise_id": 1,
      "title": "String2"
    },
    "student": {
      "student_id": 1,
      "username": "pedro"
    }
  }
]
```

**view deliver assignment's data**
Endpoint:
api/assigments/`<id>`

Verb:
GET

Response:
```json
[
  {
    "deliver_assignment_id": 2,
    "arrive_at": "2021-08-02T05:00:00.000Z",
    "audio_URL": "",
    "total_words_detected": 98,
    "assignment": {
      "assignment_id": 2,
      "due_date": "2021-08-04T05:00:00.000Z"
    },
    "exercise": {
      "exercise_id": 2,
      "title": "leer ejercicio pagina 189"
    },
    "student": {
      "student_id": 1,
      "username": "pedro"
    }
  }
]
```

**deliver an assignment**
Endpoint:
api/deliver-assignments/

Verb:
POST

Request:
```json
{
 	"assignment_id": "int",
    "student_id": "int",
    "audio_URL": "String",
    "total_words_detected": "int"
}
```

Response:
```json
{
  "message": "Assignment delivered successfully",
  "delivered_assignment": {
    "assignment_id": 1,
    "student_id": 1,
    "arrive_at": "2021-08-17T13:24:18.714Z",
    "audio_URL": "String",
    "total_words_detected": 199,
    "deliver_assignment_id": 10
  }
}
```


**Modify a deliver assignment**
Endpoint:
api/deliver-assignments/`<id>`

Verb:
PUT

Request:
```json
{
    "audio_URL": "String",
    "total_words_detected": "int"
}
```


Response:
```json
{
  "message": "Update successful!"
}
```

**Delete a deliver assignment**
Endpoint:
api/deliver-assignments/`<id>`

Verb:
DELETE

Response:
```json
{
  "message": "Deliver Assignment deleted!"
}
```
