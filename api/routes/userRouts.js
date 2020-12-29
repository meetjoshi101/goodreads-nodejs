/* eslint-disable no-unused-vars */
const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const s = require("../../helper/getSequence");

//!Post Request

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            let seq = await s.getSequence("users");
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              id: seq,
              email: req.body.email,
              name: req.body.name,
              password: hash,
              role: "U",
              genreList: req.body.genreList,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                const token = jwt.sign(
                  {
                    email: req.body.email,
                    role: "U",
                    id: seq,
                  },
                  process.env.JWT_KEY,
                  {
                    expiresIn: "30Day",
                  }
                );
                res.status(201).json({
                  message: "Auth successful",
                  token: token,
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
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              role: user[0].role,
              id: user[0].id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "30Day",
            }
          );
          return res.cookie('token2',token).status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//!Get Request

router.get("/users", auth, (req, res, next) => {
  User.find()
    .limit(10)
    .exec()
    .then((users) => {
      res.status(200).json({
        message: "get Users",
        Users: users,
      });
    });
});

router.get("/get-user-count", (req, res) => {
  User.countDocuments()
    .then((count) => {
      res.status(200).json({
        message: "Get count",
        count: count,
      });
    })
    .catch((e) => console.log(e));
});

//!Delete Request

router.delete("/:email", auth, (req, res, next) => {
  User.remove({ email: req.params.email })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//!Patch Requests

router.patch("/admin-user/:email", auth, (req, res, next) => {
  User.findOneAndUpdate({ email: req.params.email }, { role: "A" }, (err, doc) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
    res.status(200).json({ message: "Admin Added" });
  });
});

module.exports = router;
