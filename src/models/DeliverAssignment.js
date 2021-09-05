const Connection = require("./Connection");

class DeliverAssignment {
  constructor({
    assignment_id,
    student_id,
    audio_URL,
    total_words_detected,
    speech_to_text,
  }) {
    this.assignment_id = assignment_id;
    this.student_id = student_id;
    this.audio_URL = audio_URL;
    this.total_words_detected = total_words_detected;
    this.speech_to_text = speech_to_text;
  }

  static findById = (id) => {
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT DELIVER_ASSIGNMENTS.deliver_assignment_id, DELIVER_ASSIGNMENTS.arrive_at, DELIVER_ASSIGNMENTS.audio_URL, " +
          "DELIVER_ASSIGNMENTS.total_words_detected, DELIVER_ASSIGNMENTS.speech_to_text, ASSIGNMENTS.assignment_id, ASSIGNMENTS.due_date," +
          "EXERCISES.exercise_id, EXERCISES.title, EXERCISES.description, EXERCISES.words_amount, " +
          "STUDENTS.student_id, STUDENTS.username " +
          "FROM DELIVER_ASSIGNMENTS " +
          "INNER JOIN ASSIGNMENTS ON DELIVER_ASSIGNMENTS.assignment_id = ASSIGNMENTS.assignment_id " +
          "INNER JOIN EXERCISES ON ASSIGNMENTS.exercise_id = EXERCISES.exercise_id " +
          "INNER JOIN STUDENTS ON DELIVER_ASSIGNMENTS.student_id = STUDENTS.student_id " +
          "WHERE DELIVER_ASSIGNMENTS.active=1 AND DELIVER_ASSIGNMENTS.deliver_assignment_id = ? ",
        [id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results.length > 0) {
            const data = results.map((assignment) => ({
              deliver_assignment_id: assignment.deliver_assignment_id,
              arrive_at: assignment.arrive_at,
              audio_URL: assignment.audio_URL,
              total_words_detected: assignment.total_words_detected,
              speech_to_text: assignment.speech_to_text,
              assignment: {
                assignment_id: assignment.assignment_id,
                due_date: assignment.due_date,
              },
              exercise: {
                exercise_id: assignment.exercise_id,
                title: assignment.title,
              },
              student: {
                student_id: assignment.student_id,
                username: assignment.username,
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
    filters += ` WHERE EXERCISES.professor_id = '${professor_id}'  AND DELIVER_ASSIGNMENTS.active = '1' `;
    filters += " GROUP BY DELIVER_ASSIGNMENTS.deliver_assignment_id";
    if (pageSize && currentPage) {
      filters += " LIMIT " + currentPage * pageSize + " , " + pageSize;
    }

    return new Promise((resolve, reject) => {
      db.query(
        "SELECT DELIVER_ASSIGNMENTS.deliver_assignment_id, DELIVER_ASSIGNMENTS.arrive_at, DELIVER_ASSIGNMENTS.audio_URL, " +
          "DELIVER_ASSIGNMENTS.total_words_detected, DELIVER_ASSIGNMENTS.speech_to_text, ASSIGNMENTS.assignment_id, ASSIGNMENTS.due_date," +
          "EXERCISES.exercise_id, EXERCISES.title, EXERCISES.description, EXERCISES.words_amount, " +
          "STUDENTS.student_id, STUDENTS.username " +
          "FROM DELIVER_ASSIGNMENTS " +
          "INNER JOIN ASSIGNMENTS ON DELIVER_ASSIGNMENTS.assignment_id = ASSIGNMENTS.assignment_id " +
          "INNER JOIN EXERCISES ON ASSIGNMENTS.exercise_id = EXERCISES.exercise_id " +
          "INNER JOIN STUDENTS ON DELIVER_ASSIGNMENTS.student_id = STUDENTS.student_id " +
          filters,
        [],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          if (results.length > 0) {
            const data = results.map((assignment) => ({
              deliver_assignment_id: assignment.deliver_assignment_id,
              arrive_at: assignment.arrive_at,
              audio_URL: assignment.audio_URL,
              total_words_detected: assignment.total_words_detected,
              speech_to_text: assignment.speech_to_text,
              assignment: {
                assignment_id: assignment.assignment_id,
                due_date: assignment.due_date,
              },
              exercise: {
                exercise_id: assignment.exercise_id,
                title: assignment.title,
              },
              student: {
                student_id: assignment.student_id,
                username: assignment.username,
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

  static findAverageDeliverResults = ({ professor_id }) => {
    const db = Connection.getInstance();

    if (!professor_id) {
      return Promise.reject("professor_id is required");
    }

    return new Promise((resolve, reject) => {
      db.query(
        "SELECT EXERCISES.title, DELIVER_ASSIGNMENTS.assignment_id, avg(total_words_detected) avg_words_amount ,words_amount " +
          "FROM " +
          "DELIVER_ASSIGNMENTS " +
          "INNER JOIN ASSIGNMENTS ON DELIVER_ASSIGNMENTS.assignment_id = ASSIGNMENTS.assignment_id " +
          "INNER JOIN EXERCISES on ASSIGNMENTS.exercise_id  = EXERCISES.exercise_id " +
          "WHERE EXERCISES.professor_id = ? " +
          "GROUP BY DELIVER_ASSIGNMENTS.assignment_id " +
          "ORDER BY ASSIGNMENTS.due_date",
        [professor_id],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
  };

  static findLastDelivers = ({ professor_id, currentPage, pageSize }) => {
    const db = Connection.getInstance();
    let filters = "";
    if (!professor_id) {
      return Promise.reject("professor_id is required");
    }
    filters += ` WHERE EXERCISES.professor_id = '${professor_id}'  AND ASSIGNMENTS.active = '1' `;
    filters += " ORDER BY ASSIGNMENTS.due_date DESC ";
    if (pageSize && currentPage) {
      filters += " LIMIT " + currentPage * pageSize + " , " + pageSize;
    }
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT ASSIGNMENTS.assignment_id,EXERCISES.title, ASSIGNMENTS.due_date " +
          "FROM ASSIGNMENTS " +
          "JOIN " +
          "EXERCISES ON ASSIGNMENTS.exercise_id = EXERCISES.exercise_id " +
          filters,
        [],
        function (error, results, fields) {
          if (error) {
            console.log(error);
            reject(error);
          }

          if (results.length > 0) {
            const data = results.map((assignment) => ({
              assignment_id: assignment.assignment_id,
              title: assignment.title,
              due_date: assignment.due_date,
            }));
            resolve(data);
          } else {
            reject([]);
          }
        }
      );
    })
      .then((data) => {
        if (!data) {
          return resolve([]);
        }

        const assignment_ids = data.map(
          (assignment) => assignment.assignment_id
        );
        if (!assignment_ids || assignment_ids.length <= 0) {
          return resolve([]);
        }

        const dynamicParams = data.map((data) => "?");
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT assignment_id, count(deliver_assignment_id) total FROM DELIVER_ASSIGNMENTS where assignment_id in (" +
              dynamicParams +
              ") " +
              " GROUP BY assignment_id ",
            [...assignment_ids],
            function (error, results, fields) {
              if (error) {
                reject(error);
              }

              if (results.length > 0) {
                resolve(
                  data.map((data) => {
                    const total = results.find(
                      (asgmt) => asgmt.assignment_id === data.assignment_id
                    );
                    return {
                      ...data,
                      total_delivers: total ? total.total : 0,
                    };
                  })
                );
              } else {
                resolve(data.map((data) => ({ ...data, total_delivers: 0 })));
              }
            }
          );
        });
      })
      .catch(() => {
        return [];
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
        "UPDATE DELIVER_ASSIGNMENTS SET active = ?  WHERE deliver_assignment_id = ?",
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
    if (!this.student_id) {
      return Promise.reject("You need provide a student id");
    }

    if (!this.assignment_id) {
      return Promise.reject("You need provide an assignment id");
    }

    const deliverAssignment = {
      assignment_id: this.assignment_id,
      student_id: this.student_id,
      arrive_at: new Date(),
      audio_URL: this.audio_URL,
      total_words_detected: this.total_words_detected,
      speech_to_text: this.speech_to_text,
      active: true,
    };
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO DELIVER_ASSIGNMENTS SET ?",
        deliverAssignment,
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          resolve(deliverAssignment);
        }
      );
    }).then((data) => {
      return new Promise((resolve, reject) => {
        db.query(
          "SELECT deliver_assignment_id FROM DELIVER_ASSIGNMENTS " +
            "WHERE assignment_id = ? AND student_id = ? AND " +
            "audio_URL = ? AND " +
            "total_words_detected = ? AND active='1' ",
          [
            this.assignment_id,
            this.student_id,
            this.audio_URL,
            this.total_words_detected,
            this.speech_to_text,
          ],
          function (error, results, fields) {
            if (error) {
              console.log(error);
              reject(error);
            }

            if (results.length > 0) {
              deliverAssignment.deliver_assignment_id =
                results[results.length - 1].deliver_assignment_id;
              delete deliverAssignment.active;

              resolve(deliverAssignment);
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
      const arrive_at = new Date();
      db.query(
        "UPDATE DELIVER_ASSIGNMENTS SET arrive_at = ?, audio_URL = ?, total_words_detected = ?, speech_to_text = ? WHERE deliver_assignment_id = ?",
        [
          arrive_at,
          this.audio_URL,
          this.total_words_detected,
          this.speech_to_text,
          id,
        ],
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

module.exports = DeliverAssignment;
