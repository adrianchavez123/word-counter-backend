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


## Installation
The backend rest api needs MariaDB/Mysql database, so the installation of MariaDB is a requirement,below you will find the instructions to install it on a Linux distribution that supports `yum` as dependencies management.
#### Install MariaDB
1. Update the repository list
```
sudo yum update -y
```
2. Get the latest version of MariaDB
```
sudo amazon-linux-extras install -y lamp-mariadb10.2-php7.2 php7.2
```
3. Install MariaDB server (daemon)
```
sudo yum install -y httpd mariadb-server
```
4.  Start the service
```
sudo systemctl start httpd
```
5. Enable start the service automatically when the SO is booting
```
sudo systemctl enable httpd
```
6. Verify the service start at booting time 
``` 
sudo systemctl is-enabled httpd
``` 

__Note__, you can find a deeper description [here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-lamp-amazon-linux-2.html), the link describes how to install LAMP web server on Amazon Linux 2, however not all the packages are needed for this project.

#### Install Node js
The backend rest api service is a NodeJs project and its main dependency is `express` framework that is used to create rest api applications and web applications, you can find the instructions to install NodeJs at [Tutorial: Setting Up Node.js on an Amazon EC2 Instance](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html), the instructions are installing `nvm` that is a node version manager which allows change node versions easilly, to run this application you can choose the latest version.
1. Download and install nvm package
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```
2. Activate nvm package
```
. ~/.nvm/nvm.sh
````

3. Install a node version
```
nvm install node
```
4. Verify the node version installed
```
node -e "console.log('Running Node.js ' + process.version)"
``` 
__Note__, its very likely that the nvm version is attached to current user that you are using during the installation meaing that if you change users, your nvm or node command won't be recognize and probably you'll need to update the path variable.

### Configure NodeJS application to start at startup
Node JS applications can be managed by [pm2](https://www.npmjs.com/package/pm2), pm2 is process manager that is used to manage processes, it allow us to configure the application to run startup but also we can monitor the application and generate some logging file to make sure the application is performing correctly. pm2 can be installed globally with the following command.
```
sudo npm install pm2@latest -g
```
For more details about how to daemonize the application, plese go [here](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)


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
    "email": "String"
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
  "professor_id": "String",
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
      "title": "leer el cuento m??s contado",
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
    "title": "leer el cuento m??s contado",
    "description": "descripcion",
    "words_amount": 150,
    "professor_id": "fdsfdsf7d8979hnkfdsd798787"
  },
  {
    "exercise_id": 2,
    "title": "leer ejercicio pagina 189",
    "description": "descripcion",
    "words_amount": 161,
    "professor_id": "fdsfdsf7d8979hnkfdsd798787"
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
    "title": "leer el cuento m??s contado",
    "description": "descripcion",
    "words_amount": 150,
    "professor_id": "fdsfdsf7d8979hnkfdsd798787"
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
    "professor_id": "String",
    "exercise_image": "String"
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
    "professor_id": "String",
    "exercise_id": 16,
    "exercise_image": "String"
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
| api/assignments/last-assignment/`<student_id>`| GET    |     |
| api/assignments/close-pass-due-date/| GET    |     |
| api/assignments/pending-notifications/| GET    |     |
| api/assignments/delete-notification/'<fileName>`| GET    |     |

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

**last assignment**
This endpoint is used on students delivers, at student's deliver they need the id of the latest assignment and call retrives the information.
Endpoint:
api/assignments/last-assignment/<student_id>

Verb:
GET

Response:
```json
{
  "assignment_id": 1,
  "due_date": "2021-10-08T05:00:00.000Z",
  "active": 1,
  "deliver_assignment_id": 1
}
```

**close assignment**
This endpoint is used internally, every assignments contains a _due date_ so they endpoint closes any assigments that are pass due date.
Endpoint:
api/assignments/close-pass-due-date

Verb:
GET

Response:
```json
{
  "message": "2 assignments were closed."
}
```

**pending assignment notifications**
**internal use**, this endpoint retrieves all the new assignments created and a retrieves a notification template to send the telegram alerts by bot process (_bot.py_) 
Endpoint:
api/assignments/pending-notifications

Verb:
GET

Response:
```json
{
  "notifications": [
    {
      "fileName": "1b0af860-05c9-4a4b-972e-f6ddf209ebfe.json",
      "assignment_title": "el cuento m??s contado",
      "description": "leer la p??gina 189 del libro de lectura",
      "due_date": "2021-09-17",
      "image": "http://localhost:5000/images/2021_09_06_WhatsApp_Image_2021-05-30_at_11.00.56_PM.jpeg",
      "students": [
        694384,
        78904543,
        908143222,
        333996532,
        79522343
      ]
    }
  ]
}
```

**Delete notification**
**internal use**, this endpoint notifies the server a notification was sent so the backend can remove the notification template
Endpoint:
api/assignments//delete-notification/`<fileName>`

Verb:
GET

Response:
```json
{
  "message": "notification template (1b0af860-05c9-4a4b-972e-f6ddf209ebfe.json) deleted successfully."
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
| api/deliver-assignments/last-delivers| GET    | professor_id=`<id>`    |
| api/deliver-assignments/average-delivers| GET    | professor_id=`<id>`    |

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
    "speech_to_text": "",
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
    "speech_to_text": "",
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
    "total_words_detected": "int",
    "speech_to_text": "String"
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

**Get the latest deliver assignments order by professor**
Endpoint:
api/deliver-assignments/last-delivers

Verb:
GET

Response:
```json
[
  {
    "assignment_id": 1,
    "title": "el cuento mas contado (nuevo titulo)",
    "due_date": "2021-10-08T05:00:00.000Z",
    "total_delivers": 1
  }
]
```

**Average deliver word counter detection**
This endpoint can be use like a summary to the professors to get an idea how is the performance of the group.
Endpoint:
api/deliver-assignments/average-delivers

Verb:
GET

Response:
```json
[
  {
    "title": "el cuento mas contado (nuevo titulo)",
    "assignment_id": 1,
    "avg_words_amount": 80,
    "words_amount": 180
  }
]
```
