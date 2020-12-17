/* eslint-disable no-unused-vars */
const express = require("express");
require("dotenv").config();
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Book = require("../model/book");
const s = require("../../helper/getSequence");

//!Get Requests

router.post("/search", (req, res) => {
  let search = req.body.s;
  Book.find({ $text: { $search: search } }, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Search Result",
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/", (req, res, next) => {
  let page = Math.max(0, Number(req.query.page)) || 1;
  let limit = Number(req.query.limit) || 10;
  let skip = page === 1 ? 0 : (page - 1) * limit;
  let Search = req.query.search;
  if (Search) {
    console.log(Search + "Page :");
    Book.find({ $text: { $search: Search } }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Search Result",
          result: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  } else {
    console.log("in Genral");
    Book.find()
      .limit(limit)
      .skip(skip)
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Get Books",
          book: result,
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            err: err,
          });
        }
      });
  }
});

router.get("/isbn/:isb", (req, res, next) => {
  Book.find({ ISBN: req.params.isb })
    .then((result) => {
      res.status(200).json({
        message: "get book",
        book: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "err",
        err: err,
      });
    });
});

router.get("/id/:id", (req, res, next) => {
  Book.find({ id: req.params.id })
    .then((result) => {
      res.status(200).json({
        message: "get book by id",
        book: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "err",
        err: err,
      });
    });
});

router.post("/author/", (req, res, next) => {
  Book.find({ Author: req.body.name })
    .then((result) => {
      res.status(200).json({
        message: "get book by Author",
        book: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "err",
        err: err,
      });
    });
});

router.post("/title", (req, res, next) => {
  Book.find({ Title: req.body.title })
    .then((result) => {
      res.status(200).json({
        message: "get book by Title",
        book: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "err",
        err: err,
      });
    });
});

router.post("/genre", (req, res, next) => {
  Book.find({ Gener_id: req.body.Genre_id })
    .then((result) => {
      res.status(200).json({
        message: "get book by Genre",
        book: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "err",
        err: err,
      });
    });
});

//!Post Requests
router.post("/add-book", auth, (req, res, next) => {
  Book.find({ ISBN: req.body.ISBN })
    .exec()
    .then(async (result) => {
      if (result.length >= 1) {
        return res.status(409).json({
          message: "Book exists",
        });
      } else {
        let seq = await s.getSequence("books");
        const b = new Book({
          _id: new mongoose.Types.ObjectId(),
          id: seq,
          Gener_id: req.body.Gener_id,
          ISBN: req.body.ISBN,
          publication_Year: req.body.publication_Year,
          Author: req.body.Author,
          Title: req.body.Title,
          AvgRating: req.body.AvgRating,
          Image_url: req.body.Image_url,
          Image_URL_S: req.body.Image_URL_S,
        });
        b.save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "Book Created",
              Book: result,
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

//!Delete requests

router.delete("/delete/isbn/:isb", auth, (req, res, next) => {
  Book.findOneAndDelete({ ISBN: req.params.isb })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Book Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "err",
        err: err,
      });
    });
});

router.delete("/delete/id/:id", auth, (req, res, next) => {
  Book.findOneAndDelete({ id: req.params.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Book Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "err",
        err: err,
      });
    });
});

//!Patch requests

router.patch("/edit-book", auth, (req, res, next) => {
  Book.findOneAndUpdate(
    { ISBN: req.body.ISBN },
    {
      Gener_id: req.body.Gener_id,
      publication_Year: req.body.publication_Year,
      Author: req.body.Author,
      Title: req.body.Title,
      AvgRating: req.body.AvgRating,
      Image_url: req.body.Image_url,
      Image_URL_S: req.body.Image_URL_S,
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Book Updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        err: err,
      });
    });
});

module.exports = router;
