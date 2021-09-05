const express = require("express");
const Professor = require("../models/Professor");

const checkAuth = (req, res, next) => next();
const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const professor = new Professor({
    professor_id: req.body.professor_id,
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });
  professor
    .save()
    .then((createdProfessor) => {
      res.status(201).json({
        message: "Professor created successfully",
        professor: {
          ...createdProfessor,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error:${error}` });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  Professor.findById(req.params.id)
    .then((professor) => {
      if (professor) {
        res.status(200).json(professor);
      } else {
        res.status(404).json({ message: "Professor not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error ${error}` });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Professor.delete(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Professor deleted!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const professor = new Professor({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });
  professor
    .update(+req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Update successful!" });
    })
    .catch((error) => {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

module.exports = router;
