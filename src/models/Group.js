const Connection = require("./Connection");

class Group {
  constructor({ professor_id, name, students, token }) {
    this.professor_id = professor_id;
    this.name = name;
    this.students = students || [null];
    this.token = token || 0;
  }
  static join = (student_id, token, username) => {
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT GROUPS.group_id, GROUPS.student_id, GROUPS.name, GROUPS.token, GROUPS.professor_id  " +
          "FROM `GROUPS` " +
          "WHERE `token` = ?  AND GROUPS.active='1' ",
        [token],
        function (error, results, fields) {
          if (error) {
            console.log(error);
            return reject(error);
          }
          if (results?.length > 0) {
            return resolve(results);
          }
          return resolve();
        }
      );
    }).then((group) => {
      if (!group) {
        return resolve();
      }
      const [groupData] = group;
      const registeredStudent = group
        .map((g) => g.student_id)
        .find((id) => +id === +student_id);

      if (registeredStudent) {
        return Promise.resolve({
          message: `registered to group: ${groupData.name}`,
        });
      }
      const registerStudent = [
        groupData.group_id,
        groupData.professor_id,
        student_id,
        groupData.name,
        true,
        token,
      ];
      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO GROUPS (group_id,professor_id,student_id,name,active,token) VALUES (?)",
          [registerStudent],
          function (error, results, fields) {
            if (error) {
              console.log(error);
              return reject(error);
            }
            resolve({
              message: `registered to group: ${groupData.name}`,
            });
          }
        );
      });
    });
  };

  static findById = (id) => {
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT GROUPS.group_id, GROUPS.student_id, GROUPS.name, STUDENTS.id, STUDENTS.username, GROUPS.token  " +
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
                id: row.id,
              })),
              token: results[0].token,
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
        "SELECT GROUPS.group_id, GROUPS.student_id, GROUPS.name, STUDENTS.id,STUDENTS.username, GROUPS.token  " +
          "FROM `GROUPS` " +
          "LEFT  JOIN STUDENTS ON GROUPS.student_id = STUDENTS.student_id " +
          "WHERE GROUPS.professor_id = ? AND GROUPS.active='1' ",
        [professor_id],
        function (error, results, fields) {
          if (error) {
            return reject(error);
          }
          if (results?.length > 0) {
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
                        id: row.id,
                      })),
                    token: group.token,
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

          if (results?.length > 0) {
            resolve(results[0].group_id);
          } else {
            resolve(0);
          }
        }
      );
    }).then((last_id) => {
      const group_id = Number(last_id) + 1;
      const rows = this.students
        .filter((student) => student?.id !== null)
        .map((student) => [
          group_id,
          this.professor_id,
          student?.student_id,
          this.name,
          true,
          this.token,
          0,
        ]);

      const rowsArray =
        rows.length > 0
          ? rows
          : [
              [
                group_id,
                this.professor_id,
                null,
                this.name,
                true,
                this.token,
                0,
              ],
            ];
      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO GROUPS (group_id,professor_id,student_id,name,active,token,id) VALUES ?",
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

    const membersList = [
      ...this.students
        .filter((st) => st.student_id !== null)
        .map((st) => st.student_id),
    ];

    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE GROUPS SET name = ? , token = ? WHERE group_id = ?",
        [this.name, this.token, id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          resolve({ updated: true });
        }
      );
    })
      .then((data) => {
        if (!data.updated) {
          return resolve({ updated: true });
        }
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM GROUPS where group_id = ?",
            [id],
            function (error, results, fields) {
              if (error) {
                reject(error);
              }
              const inactiveMembers = [];
              const membersToAdd = [];
              results.forEach((g) => {
                if (
                  !membersList.includes(g.student_id) &&
                  g.student_id !== null
                ) {
                  inactiveMembers.push(g.student_id);
                }
              });

              const membersInDB = results.map((r) => r.student_id);
              membersList.forEach((member) => {
                if (!membersInDB.includes(member)) {
                  membersToAdd.push(member);
                }
              });
              resolve({
                inactiveMembers: inactiveMembers,
                membersToAdd: membersToAdd,
              });
            }
          );
        });
      })
      .then((entries) => {
        return new Promise((resolve, reject) => {
          const inactiveList = entries.inactiveMembers.map(
            (entry) => `'${entry}'`
          );
          const ids = [...new Set(inactiveList)].join(",");
          if (ids.length == 0) {
            return resolve(entries.membersToAdd);
          }
          db.query(
            `UPDATE GROUPS SET active = ? WHERE group_id = ? AND student_id IN (${ids})`,
            [false, id],
            function (error, results, fields) {
              console.log(error);
              if (error) {
                return reject(error);
              }
              return resolve(entries.membersToAdd);
            }
          );
        });
      })
      .then((membersToAdd) => {
        if (membersToAdd.length == 0) {
          return Promise.resolve({ updated: true });
        }
        const studentsToAddObject = this.students.filter((st) =>
          membersToAdd.includes(st.student_id)
        );
        const rows = studentsToAddObject.map((student) => [
          id,
          this.professor_id,
          student?.student_id,
          this.name,
          true,
          this.token,
          student?.id,
        ]);

        const rowsArray = rows.length > 0 ? rows : [...row];
        return new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO GROUPS (group_id,professor_id,student_id,name,active,token, id) VALUES ?",
            [rowsArray],
            function (error, results, fields) {
              if (error) {
                reject(error);
              }
              resolve({
                updated: true,
              });
            }
          );
        });
      });
  };
}

module.exports = Group;
