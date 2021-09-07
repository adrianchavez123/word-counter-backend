const Connection = require("./Connection");

class Group {
  constructor({ professor_id, name, students }) {
    this.professor_id = professor_id;
    this.name = name;
    this.students = students || [null];
  }

  static findById = (id) => {
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT GROUPS.group_id, GROUPS.student_id, GROUPS.name, STUDENTS.username  " +
          "FROM `GROUPS` " +
          "LEFT  JOIN STUDENTS ON GROUPS.student_id = STUDENTS.student_id " +
          "WHERE `group_id` = ?  AND GROUPS.active='1' ",
        [id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results.length > 0) {
            const data = {
              group_id: results[0].group_id,
              name: results[0].name,
              students: results.map((row) => ({
                student_id: row.student_id,
                username: row.username,
              })),
            };
            return resolve(data);
          }
          resolve();
        }
      );
    });
  };

  static find = ({ professor_id }) => {
    const db = Connection.getInstance();

    if (!professor_id) {
      return Promise.reject("professor_id is required");
    }

    return new Promise((resolve, reject) => {
      db.query(
        "SELECT GROUPS.group_id, GROUPS.student_id, GROUPS.name, STUDENTS.username  " +
          "FROM `GROUPS` " +
          "LEFT  JOIN STUDENTS ON GROUPS.student_id = STUDENTS.student_id " +
          "WHERE GROUPS.professor_id = ? AND GROUPS.active='1' ",
        [professor_id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results.length > 0) {
            const groupIds = results.map((row) => row.group_id);
            const ids = [...new Set(groupIds)];
            const data = {
              professor_id: results[0].professor_id,
              groups: [
                ...ids.map((id) => {
                  const group = results.find((row) => row.group_id === id);
                  return {
                    group_id: group.group_id,
                    name: group.name,
                    students: results
                      .filter((row) => row.group_id === id)
                      .map((row) => ({
                        student_id: row.student_id,
                        username: row.username,
                      })),
                  };
                }),
              ],
            };
            return resolve(data);
          }
          resolve();
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
        "UPDATE GROUPS SET active = ?  WHERE group_id = ?",
        [false, id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results.length > 0) {
            return resolve(results);
          }
          resolve();
        }
      );
    });
  };

  save = () => {
    if (!this.name) {
      return Promise.reject("You need provide a name");
    }
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT group_id from GROUPS GROUP BY group_id ORDER BY group_id DESC LIMIT 1",
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results.length > 0) {
            resolve(results[0].group_id);
          } else {
            resolve(0);
          }
        }
      );
    }).then((last_id) => {
      const group_id = Number(last_id) + 1;
      const rows = this.students.map((student) => [
        group_id,
        this.professor_id,
        student,
        this.name,
        true,
      ]);
      const rowsArray =
        rows.length > 0
          ? rows
          : [[group_id, this.professor_id, null, this.name, true]];
      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO GROUPS (group_id,professor_id,student_id,name,active) VALUES ?",
          [rowsArray],
          function (error, results, fields) {
            if (error) {
              reject(error);
            }
            resolve({
              name: this.name,
              group_id: group_id,
              students: this.students,
            });
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
        "UPDATE GROUPS SET name = ? WHERE group_id = ?",
        [this.name, id],
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

module.exports = Group;
