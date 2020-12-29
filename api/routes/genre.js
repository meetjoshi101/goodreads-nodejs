/* eslint-disable no-unused-vars */
const express = require("express");
require("dotenv").config();
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Genre = require("../model/genre");
const s = require("../../helper/getSequence");
const { route } = require("./read");

//!Get Request

router.get("/", (req, res) => {
  Genre.find()
    .exec()
    .then((doc) => {
      res.status(200).json({ genres: doc });
    });
});

router.get("/id/:id", (req, res) => {
  Genre.find({ id: req.params.id })
    .exec()
    .then((doc) => {
      res.status(200).json({ genre: doc });
    });
});

router.get("/get-genre-count", (req, res) => {
  Genre.countDocuments()
    .then((count) => {
      res.status(200).json({
        message: "Get count",
        count: count,
      });
    })
    .catch((e) => console.log(e));
});
//!Post Request

router.post("/add-genre", auth, (req, res) => {
  Genre.find({ name: req.body.name })
    .exec()
    .then(async (genre) => {
      if (genre.length >= 1) {
        return res.status(409).json({
          message: "Genre exists",
        });
      } else {
        let seq = await s.getSequence("genres");
        const gen = Genre({
          _id: new mongoose.Types.ObjectId(),
          id: seq,
          name: req.body.name,
        });
        gen
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "Genre Created",
              genre: result,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
});
//!Patch
router.patch("/edit-genre/:id", auth, (req, res) => {
  Genre.findOneAndUpdate({ id: req.params.id }, { name: req.body.name })
    .exec()
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      res.status(200).json({
        message: "Genre Updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        err: err,
      });
    });
});
//!Delete Request

router.delete("/delete/:id", auth, (req, res) => {
  Genre.remove({ id: req.params.id })
    .exec()
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      res.status(200).json({
        message: "Genre Deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
