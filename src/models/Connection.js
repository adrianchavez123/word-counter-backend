const mysql = require("mysql");
const { host, user, pwd, database } = require("../../config");
const db = mysql.createConnection({
  host: host,
  user: user,
  password: pwd,
  database: database,
});

db.connect((error) => {
  if (error) {
    console.log(error);
    // throw error;
  }
});

class Connection {
  static db;

  static getInstance() {
    if (!Connection.db) {
      Connection.db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "my-secret-pw",
        database: "WORD_COUNTER",
      });
      db.connect((error) => {
        if (error) {
          // throw error;
        }
      });
    }
    return Connection.db;
  }
}

module.exports = Connection;
