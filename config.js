const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  port: process.env.PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pwd: process.env.DB_PWD,
  database: process.env.DB_NAME,
  staticImageURL: process.env.STATIC_IMAGE_URL,
};
