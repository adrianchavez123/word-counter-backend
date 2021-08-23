const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const exercisesRoutes = require("./routes/exercises");
const userRoutes = require("./routes/assignments");
const groupRoutes = require("./routes/groups");
const professorsRoutes = require("./routes/professors");
const studentsRoutes = require("./routes/students");
const deliverAssignementsRoutes = require("./routes/deliver-assignments");
const formatDate = require("./utils/data-utils");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, formatDate(Date.now()) + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post("/image", upload.single("image"), function (req, res, next) {
  return res.json({ message: "single file uploaded" });
});
app.use("/api/exercises", exercisesRoutes);
app.use("/api/assignments", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/professors", professorsRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/deliver-assignments", deliverAssignementsRoutes);

module.exports = app;
