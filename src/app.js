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
    cb(
      null,
      formatDate(Date.now()) + "_" + file.originalname.replace(/ /g, "_")
    );
  },
});
const upload = multer({ storage: storage });
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  process.env.STATIC_IMAGE_URL,
  express.static(path.join(__dirname, "../public/images"))
);
app.use(
  process.env.STATIC_AUDIO_URL,
  express.static(path.join(__dirname, "../public/audios"))
);

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

app.use(express.static(path.join(__dirname, "../build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
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

app.use(function (req, res, next) {
  return res.redirect("/");
});
module.exports = app;
