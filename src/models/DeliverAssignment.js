const Connection = require("./Connection");

class DeliverAssignment {
  constructor({ assignment_id, student_id, audio_URL, total_words_detected }) {
    this.assignment_id = assignment_id;
    this.student_id = student_id;
    this.audio_URL = audio_URL;
    this.total_words_detected = total_words_detected;
  }

  static findById = (id) => {
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT DELIVER_ASSIGNMENTS.deliver_assignment_id, DELIVER_ASSIGNMENTS.arrive_at, DELIVER_ASSIGNMENTS.audio_URL, " +
          "DELIVER_ASSIGNMENTS.total_words_detected, ASSIGNMENTS.assignment_id, ASSIGNMENTS.due_date," +
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
    filters +=
      " WHERE EXERCISES.professor_id = " +
      professor_id +
      " AND DELIVER_ASSIGNMENTS.active = '1' ";
    filters += " GROUP BY DELIVER_ASSIGNMENTS.deliver_assignment_id";
    if (pageSize && currentPage) {
      filters += " LIMIT " + currentPage * pageSize + " , " + pageSize;
    }

    return new Promise((resolve, reject) => {
      db.query(
        "SELECT DELIVER_ASSIGNMENTS.deliver_assignment_id, DELIVER_ASSIGNMENTS.arrive_at, DELIVER_ASSIGNMENTS.audio_URL, " +
          "DELIVER_ASSIGNMENTS.total_words_detected, ASSIGNMENTS.assignment_id, ASSIGNMENTS.due_date," +
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
        "UPDATE DELIVER_ASSIGNMENTS SET arrive_at = ?, audio_URL = ?, total_words_detected = ? WHERE deliver_assignment_id = ?",
        [arrive_at, this.audio_URL, this.total_words_detected, id],
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
