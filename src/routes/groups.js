const express = require("express");
const Group = require("../models/Group");

const checkAuth = (req, res, next) => next();
const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const group = new Group({
    professor_id: req.body.professor_id,
    name: req.body.name,
    students: req.body.students,
    token: req.body.token,
  });
  group
    .save()
    .then((createdGroup) => {
      res.status(201).json({
        message: "Group created successfully",
        group: {
          ...createdGroup,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error:${error}` });
    });
});

router.get("/join/:student_id/:token", checkAuth, (req, res, next) => {
  const student_id = req.params.student_id;
  const token = req.params.token;
  Group.join(student_id, token)
    .then((group) => {
      if (group) {
        res.status(200).json(group);
      } else {
        res.status(404).json({ message: "Group not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  Group.findById(req.params.id)
    .then((group) => {
      if (group) {
        res.status(200).json(group);
      } else {
        res.status(404).json({ message: "Group not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("", checkAuth, (req, res, next) => {
  const professor_id = req.query.professor_id;
  Group.find({ professor_id })
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "No Group!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Group.delete(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Group deleted!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.put("/:id", checkAuth, (req, res, next) => {
  // TODO: how to add an remove students
  const group = new Group({
    professor_id: req.body.professor_id,
    name: req.body.name,
    token: req.body.token,
  });
  group
    .update(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Update successful!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

module.exports = router;
