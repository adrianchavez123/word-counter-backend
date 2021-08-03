const Connection = require("./Connection");

class Assignment {
  constructor({ due_date, exercise_id, group_id }) {
    this.due_date = due_date;
    this.exercise_id = exercise_id;
    this.group_id = group_id;
  }

  static findById = (id) => {
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT ASSIGNMENTS.assignment_id, ASSIGNMENTS.create_at, ASSIGNMENTS.due_date, ASSIGNMENTS.exercise_id, ASSIGNMENTS.group_id, " +
          "EXERCISES.title, GROUPS.group_id,GROUPS.name " +
          " FROM ASSIGNMENTS " +
          "INNER JOIN EXERCISES ON ASSIGNMENTS.exercise_id = EXERCISES.exercise_id " +
          "INNER JOIN GROUPS ON ASSIGNMENTS.group_id = GROUPS.group_id " +
          "WHERE ASSIGNMENTS.assignment_id = ? and ASSIGNMENTS.active ='1' " +
          " GROUP BY ASSIGNMENTS.assignment_id",
        [id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results.length > 0) {
            const data = results.map((assignment) => ({
              assignment_id: assignment.assignment_id,
              create_at: assignment.create_at,
              due_date: assignment.due_date,
              group: {
                group_id: assignment.group_id,
                group_name: assignment.name,
              },
              exercise: {
                exercise_id: assignment.exercise_id,
                title: assignment.title,
              },
            }));
            resolve(data);
          } else {
            resolve([]);
          }
        }
      );
    });
  };

  static find = ({ professor_id, currentPage, pageSize }) => {
    const db = Connection.getInstance();
    let filters = "";
    if (!professor_id) {
      return Promise.reject("professor_id is required");
    }
    filters +=
      " WHERE EXERCISES.professor_id = " +
      professor_id +
      " AND ASSIGNMENTS.active = '1' ";
    if (pageSize && currentPage) {
      filters += " LIMIT " + currentPage * pageSize + " , " + pageSize;
    }
    filters += " GROUP BY ASSIGNMENTS.assignment_id";

    return new Promise((resolve, reject) => {
      db.query(
        "SELECT ASSIGNMENTS.assignment_id, ASSIGNMENTS.create_at, ASSIGNMENTS.due_date, ASSIGNMENTS.exercise_id, ASSIGNMENTS.group_id, " +
          "EXERCISES.title, GROUPS.group_id,GROUPS.name " +
          " FROM `ASSIGNMENTS` " +
          "INNER JOIN EXERCISES ON ASSIGNMENTS.exercise_id = EXERCISES.exercise_id " +
          "INNER JOIN GROUPS ON ASSIGNMENTS.group_id = GROUPS.group_id" +
          filters,
        [1],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }

          if (results.length > 0) {
            const data = results.map((assignment) => ({
              assignment_id: assignment.assignment_id,
              create_at: assignment.create_at,
              due_date: assignment.due_date,
              group: {
                group_id: assignment.group_id,
                group_name: assignment.name,
              },
              exercise: {
                exercise_id: assignment.exercise_id,
                title: assignment.title,
              },
            }));
            resolve(data);
          } else {
            resolve([]);
          }
        }
      );
    });
  };

  static deleteOne = (id) => {
    if (!id) {
      return Promise.reject("You need provide an id");
    }
    if (typeof id !== "number") {
      return Promise.reject("You need provide an id number");
    }
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE ASSIGNMENTS SET active = ?  WHERE assignment_id = ?",
        [false, id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
  };

  save = () => {
    if (!this.group_id) {
      return Promise.reject("You need provide a group id");
    }

    if (!this.exercise_id) {
      return Promise.reject("You need provide an exercise id");
    }
    const assignment = {
      due_date: this.due_date,
      exercise_id: this.exercise_id,
      create_at: new Date(),
      group_id: this.group_id,
      active: true,
    };
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO ASSIGNMENTS SET ?",
        assignment,
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          resolve(assignment);
        }
      );
    }).then((data) => {
      return new Promise((resolve, reject) => {
        db.query(
          "SELECT ASSIGNMENTS.assignment_id, GROUPS.name,EXERCISES.title FROM ASSIGNMENTS " +
            "INNER JOIN EXERCISES ON ASSIGNMENTS.exercise_id = EXERCISES.exercise_id " +
            "INNER JOIN GROUPS ON ASSIGNMENTS.group_id = GROUPS.group_id " +
            "WHERE ASSIGNMENTS.due_date = ? AND ASSIGNMENTS.exercise_id = ? AND ASSIGNMENTS.group_id = ? AND ASSIGNMENTS.active='1' " +
            "GROUP BY ASSIGNMENTS.assignment_id",
          [this.due_date, this.exercise_id, this.group_id],
          function (error, results, fields) {
            if (error) {
              reject(error);
            }
            if (results.length > 0) {
              delete assignment.active;
              assignment.assignment_id =
                results[results.length - 1].assignment_id;
              assignment.exercise_name = results[results.length - 1].title;
              assignment.group_name = results[results.length - 1].name;
              resolve(assignment);
            } else {
              resolve();
            }
          }
        );
      });
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
        "UPDATE ASSIGNMENTS SET due_date = ?, exercise_id = ?, group_id = ? WHERE assignment_id = ?",
        [this.due_date, this.exercise_id, this.group_id, id],
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

module.exports = Assignment;
