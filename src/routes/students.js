const express = require("express");
const Student = require("../models/Student");

const checkAuth = (req, res, next) => next();
const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const student = new Student({
    username: req.body.username,
    student_id: req.body.student_id,
  });
  student
    .save()
    .then((createdStudent) => {
      res.status(201).json({
        message: "Student created successfully",
        student: {
          ...createdStudent,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error:${error}` });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  Student.findById(req.params.id)
    .then((student) => {
      if (student) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ message: "Student not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("", checkAuth, (req, res, next) => {
  const professor_id = req.query.professor_id;
  Student.find({ professor_id })
    .then((student) => {
      if (student) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ message: "No Student!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Student.delete(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Student deleted!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const student = new Student({
    username: req.body.username,
  });
  student
    .update(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Update successful!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

module.exports = router;
