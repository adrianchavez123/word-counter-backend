const express = require("express");
const DeliverAssignment = require("../models/DeliverAssignment");

const checkAuth = (req, res, next) => next();
const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const assignment = new DeliverAssignment({
    assignment_id: req.body.assignment_id,
    student_id: req.body.student_id,
    audio_URL: req.body.audio_URL,
    total_words_detected: req.body.total_words_detected,
    speech_to_text: req.body.speech_to_text,
  });
  assignment
    .save()
    .then((deliveredAssignment) => {
      res.status(201).json({
        message: "Assignment delivered successfully",
        delivered_assignment: {
          ...deliveredAssignment,
        },
      });
    })
    .catch((error) => {
      res.status(404).json({ message: `Internal Server Error: ${error}` });
    });
});

router.get("/last-delivers", checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const professor_id = +(+req.query.professor_id);
  DeliverAssignment.findLastDelivers({ professor_id, currentPage, pageSize })
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "No Assignment!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.get("/average-delivers", checkAuth, (req, res, next) => {
  const professor_id = +(+req.query.professor_id);
  DeliverAssignment.findAverageDeliverResults({ professor_id })
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "No Assignment!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  DeliverAssignment.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Assignment not found!" });
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
  DeliverAssignment.find({ professor_id, currentPage, pageSize })
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "No Assignment!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  DeliverAssignment.deleteOne(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Deliver Assignment deleted!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const assignment = new DeliverAssignment({
    assignment_id: req.body.assignment_id,
    student_id: req.body.student_id,
    audio_URL: req.body.audio_URL,
    total_words_detected: req.body.total_words_detected,
    speech_to_text: req.body.speech_to_text,
  });
  assignment
    .update(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Update successful!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

module.exports = router;
