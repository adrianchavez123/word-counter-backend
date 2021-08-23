const express = require("express");
const Exercise = require("../models/Exercise");
const checkAuth = (req, res, next) => next();
const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const exercise = new Exercise({
    title: req.body.title,
    description: req.body.description,
    words_amount: req.body.words_amount,
    professor_id: req.body.professor_id,
    exercise_image: req.body.exercise_image,
  });
  exercise.save().then((createdExercise) => {
    res.status(201).json({
      message: "Exercise added successfully",
      exercise: {
        ...createdExercise,
      },
    });
  });
});

router.get("/:id", checkAuth, (req, res, next) => {
  Exercise.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Exercise not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("", checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const professor_id = +(+req.query.professor_id);
  Exercise.find({ professor_id, currentPage, pageSize })
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "No Exercises!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Exercise.deleteOne(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Exercise deleted!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const exercise = new Exercise({
    title: req.body.title,
    description: req.body.description,
    words_amount: req.body.words_amount,
    professor_id: req.body.professor_id,
  });
  exercise
    .update(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Update successful!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});
module.exports = router;
