const Connection = require("./Connection");

class Professor {
  constructor({ username, student_id, id }) {
    this.username = username;
    this.student_id = student_id;
    this.id = id;
  }

  static findById = (id) => {
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT STUDENTS.id, STUDENTS.student_id,STUDENTS.username, GROUPS.group_id, GROUPS.name AS group_name, " +
          " ASSIGNMENTS.assignment_id, ASSIGNMENTS.due_date, EXERCISES.exercise_id, EXERCISES.title, EXERCISES.words_amount " +
          "FROM STUDENTS LEFT JOIN GROUPS ON STUDENTS.student_id = GROUPS.student_id " +
          "LEFT JOIN ASSIGNMENTS ON GROUPS.group_id = ASSIGNMENTS.group_id " +
          "LEFT JOIN EXERCISES ON ASSIGNMENTS.exercise_id = EXERCISES.exercise_id " +
          "WHERE STUDENTS.id = ? AND STUDENTS.active = 1",
        [id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results.length > 0) {
            const assignments = [];
            const groups = [];
            const data = {
              id: results[0].id,
              student_id: results[0].student_id,
              username: results[0].username,
              groups: results
                .map((row) => ({
                  group_name: row.group_name,
                  group_id: row.group_id,
                }))
                .filter((group) => {
                  if (!group.group_id) {
                    return false;
                  }
                  if (groups.includes(group.group_id)) {
                    return false;
                  } else {
                    groups.push(group.group_id);
                    return true;
                  }
                }),
              assignments: results
                .map((row) => ({
                  title: row.title,
                  exercise_id: row.exercise_id,
                  words_amount: row.words_amount,
                }))
                .filter((assignment) => {
                  if (!assignment.exercise_id) {
                    return false;
                  }
                  if (assignments.includes(assignment.exercise_id)) {
                    return false;
                  } else {
                    assignments.push(assignment.exercise_id);
                    return true;
                  }
                }),
            };
            return resolve({
              ...data,
              groups: data.groups[0] ? data.groups : [],
            });
          } else {
            resolve();
          }
        }
      );
    });
  };

  static find = ({ professor_id }) => {
    const db = Connection.getInstance();
    let filters = "";
    if (!professor_id) {
      return Promise.reject("professor_id is required");
    }
    filters += ` WHERE EXERCISES.professor_id = '${professor_id}'`;

    return new Promise((resolve, reject) => {
      db.query(
        "SELECT STUDENTS.id,STUDENTS.student_id, STUDENTS.username,GROUPS.group_id, GROUPS.name AS group_name " +
          "FROM STUDENTS LEFT JOIN GROUPS ON STUDENTS.student_id = GROUPS.student_id " +
          "WHERE GROUPS.professor_id = ?",
        professor_id,
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results.length > 0) {
            const students = [];
            const data = results
              .map((student) => {
                return {
                  id: student.id,
                  student_id: student.student_id,
                  username: student.username,
                  groups: results
                    .filter((row) => row.student_id === student.student_id)
                    .map((row) => {
                      return {
                        group_name: row.group_name,
                        group_id: row.group_id,
                      };
                    }),
                };
              })
              .filter((student) => {
                if (!student.student_id) {
                  return false;
                }
                if (students.includes(student.student_id)) {
                  return false;
                } else {
                  students.push(student.student_id);
                  return true;
                }
              });
            return resolve([...data]);
          } else {
            resolve();
          }
        }
      );
    });
  };

  static delete = (id) => {
    if (!id) {
      return Promise.reject("You need provide an id");
    }
    if (typeof id !== "number") {
      return Promise.reject("You need provide an id number");
    }
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE STUDENTS SET active = ?  WHERE id = ?",
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
            "UPDATE GROUPS SET active = ?  WHERE student_id = ?",
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
            "UPDATE DELIVER_ASSIGNMENTS SET active = ?  WHERE student_id = ?",
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
    if (!this.username) {
      return Promise.reject("You need provide a name");
    }

    const student = {
      username: this.username,
      student_id: this.student_id,
      active: true,
    };

    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO STUDENTS SET ?",
        student,
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          delete student.active;
          resolve(student);
        }
      );
    });
  };

  update = (id) => {
    if (!id) {
      return Promise.reject("You need provide an id");
    }
    if (typeof id !== "number") {
      return Promise.reject("You need provide an id number");
    }

    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE STUDENTS SET username = ? , student_id = ?  WHERE id = ?",
        [this.username, this.student_id, id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results && results.affectedRows === 1) {
            return resolve({ updated: true });
          }
          return resolve({ updated: false });
        }
      );
    });
  };
}

module.exports = Professor;
