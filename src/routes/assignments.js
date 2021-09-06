const express = require("express");
const Assignment = require("../models/Assignment");

const checkAuth = (req, res, next) => next();
const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const assignment = new Assignment({
    due_date: req.body.due_date,
    exercise_id: req.body.exercise_id,
    group_id: req.body.group_id,
  });
  assignment
    .save()
    .then((createdAssignment) => {
      res.status(201).json({
        message: "Assignment created successfully",
        assignment: {
          ...createdAssignment,
        },
      });
    })
    .catch((error) => {
      res.status(404).json({ message: `Internal Server Error: ${error}` });
    });
});

router.get("/last-assignment/:student_id", checkAuth, (req, res, next) => {
  Assignment.findLastAssignment(req.params.student_id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Assignment not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

router.get("/close-pass-due-date", checkAuth, (req, res, next) => {
  Assignment.closePassDueDate()
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Assignment not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

router.get("/pending-notifications", checkAuth, (req, res, next) => {
  Assignment.getPendingNotifications()
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json(post);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error });
    });
});

router.get("/delete-notification/:fileName", checkAuth, (req, res, next) => {
  Assignment.deleteNotificationTemplate(req.params.fileName)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json(post);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  Assignment.findById(req.params.id)
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
  const professor_id = req.query.professor_id;
  Assignment.find({ professor_id, currentPage, pageSize })
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
  Assignment.deleteOne(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Assignment deleted!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const assignment = new Assignment({
    due_date: req.body.due_date,
    exercise_id: req.body.exercise_id,
    group_id: req.body.group_id,
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
