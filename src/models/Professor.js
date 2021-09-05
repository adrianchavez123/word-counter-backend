const Connection = require("./Connection");

class Professor {
  constructor({ professor_id, username, name, email }) {
    this.professor_id = professor_id;
    this.username = username;
    this.name = name;
    this.email = email;
  }

  static findById = (id) => {
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT PROFESSORS.professor_id, PROFESSORS.username,PROFESSORS.name, PROFESSORS.email, GROUPS.group_id," +
          "GROUPS.name AS group_name, GROUPS.student_id, EXERCISES.exercise_id, EXERCISES.title " +
          "FROM PROFESSORS " +
          "LEFT JOIN GROUPS ON PROFESSORS.professor_id = GROUPS.professor_id " +
          "LEFT JOIN EXERCISES ON PROFESSORS.professor_id = EXERCISES.professor_id " +
          "WHERE PROFESSORS.professor_id = ? AND PROFESSORS.active = 1",
        [id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results.length > 0) {
            const data = {
              professor_id: results[0].professor_id,
              name: results[0].name,
              username: results[0].username,
              groups: results.map((row) => ({
                group_name: row.group_name,
                group_id: row.group_id,
              })),
              exercises: results.map((row) => ({
                title: row.title,
                exercise_id: row.exercise_id,
              })),
            };
            return resolve({
              ...data,
              groups: data.groups[0].group_id ? data.groups : [],
            });
          } else {
            resolve();
          }
        }
      );
    }).then((data) => {
      if (!data) {
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        if (data.exercises[0].group_id) {
          const exercises = data.exercises.map(
            (exercise) => exercise.exercise_id
          );
          const ids = [...new Set(exercises)].join(",");
          db.query(
            `SELECT * FROM ASSIGNMENTS WHERE exercise_id IN (${ids}) `,
            function (error, results, fields) {
              if (error) {
                reject(error);
              }
              return resolve({ ...data, assignments: [...results] });
            }
          );
        } else {
          resolve({ ...data, exercises: [] });
        }
      });
    });
  };

  static delete = (id) => {
    if (!id) {
      return Promise.reject("You need provide an id");
    }

    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE PROFESSORS SET active = ?  WHERE professor_id = ?",
        [false, id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          resolve();
        }
      );
    })
      .then(() => {
        const db = Connection.getInstance();
        return new Promise((resolve, reject) => {
          db.query(
            "UPDATE GROUPS SET active = ?  WHERE professor_id = ?",
            [false, id],
            function (error, results, fields) {
              if (error) {
                reject(error);
              }
              resolve();
            }
          );
        });
      })
      .then(() => {
        const db = Connection.getInstance();
        return new Promise((resolve, reject) => {
          db.query(
            "UPDATE EXERCISES SET active = ?  WHERE professor_id = ?",
            [false, id],
            function (error, results, fields) {
              if (error) {
                reject(error);
              }
              resolve();
            }
          );
        });
      });
  };

  save = () => {
    // if (!this.name) {
    //   return Promise.reject("You need provide a name");
    // }
    if (!this.email) {
      return Promise.reject("You need provide an email");
    }
    const professor = {
      professor_id: this.professor_id,
      username: this.username,
      name: this.name,
      email: this.email,
      active: true,
    };

    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO PROFESSORS SET ?",
        professor,
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          delete professor.active;
          resolve(professor);
        }
      );
    });
  };

  update = (id) => {
    if (!id) {
      return Promise.reject("You need provide an id");
    }

    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE PROFESSORS SET username = ? , name = ? , email = ? WHERE professor_id = ?",
        [this.username, this.name, this.email, id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          resolve({ updated: true });
        }
      );
    });
  };
}

module.exports = Professor;
