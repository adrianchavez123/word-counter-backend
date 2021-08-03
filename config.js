const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  port: process.env.port,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pwd: process.env.DB_PWD,
  database: process.env.DB_NAME,
};
