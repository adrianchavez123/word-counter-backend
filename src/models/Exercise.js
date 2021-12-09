const publicIp = require("public-ip");
const Connection = require("./Connection");
const formatDate = require("../utils/data-utils");
const { staticImageURL, port } = require("../../config");
class Exercise {
  constructor({
    title,
    description,
    words_amount,
    professor_id,
    exercise_image,
    content,
  }) {
    this.title = title;
    this.description = description;
    this.words_amount = words_amount;
    this.professor_id = professor_id;
    this.exercise_image = exercise_image;
    this.content = content;
  }

  static findById = (id) => {
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT exercise_id, title, description, words_amount, professor_id, exercise_image, content FROM `EXERCISES` WHERE `exercise_id` = ?  AND active='1' ",
        [id],
        function (error, results, fields) {
          if (error) {
            console.log(error);
            reject(error);
          }
          resolve(results);
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
    filters += ` WHERE professor_id = '${professor_id}' AND active='1' `;
    if (pageSize && currentPage) {
      filters += " LIMIT " + currentPage * pageSize + " , " + pageSize;
    }

    return new Promise((resolve, reject) => {
      db.query(
        "SELECT exercise_id, title, description, words_amount, professor_id, exercise_image, content FROM `EXERCISES` " +
          filters,
        [1],
        function (error, results, fields) {
          if (error) {
            reject(error);
          }
          resolve(results);
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
        "UPDATE EXERCISES SET active = ?  WHERE exercise_id = ?",
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
    const excercise = {
      title: this.title,
      description: this.description,
      words_amount: this.words_amount,
      professor_id: this.professor_id,
      exercise_image: this.exercise_image
        ? staticImageURL +
          "/" +
          formatDate(Date.now()) +
          "_" +
          this.exercise_image.replace(/ /g, "_")
        : null,
      content: this.content,
      active: true,
    };
    const db = Connection.getInstance();
    return new Promise((resolve, reject) => {
      if (this.exercise_image) {
        return resolve(publicIp.v4());
      }
      resolve();
    }).then((ip) => {
      if (ip) {
        excercise.exercise_image = `http://${ip}:${port}${excercise.exercise_image}`;
      }
      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO EXERCISES SET ?",
          excercise,
          function (error, results, fields) {
            if (error) {
              reject(error);
            }
            resolve(excercise);
          }
        );
      }).then((data) => {
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT exercise_id FROM EXERCISES WHERE title = ? AND description = ? AND words_amount = ? AND professor_id = ? AND active='1' ",
            [
              this.title,
              this.description,
              this.words_amount,
              this.professor_id,
            ],
            function (error, results, fields) {
              if (error) {
                reject(error);
              }

              if (results.length > 0) {
                delete excercise.active;
                excercise.exercise_id = results[results.length - 1].exercise_id;
                resolve(excercise);
              } else {
                resolve();
              }
            }
          );
        });
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
        "UPDATE EXERCISES SET title = ?, description = ?,words_amount = ?, content = ? WHERE exercise_id = ?",
        [this.title, this.description, this.words_amount, this.content, id],
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

module.exports = Exercise;
