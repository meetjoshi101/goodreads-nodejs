const express = require("express");
require("dotenv").config();
const router = express.Router();
const mongoose = require("mongoose");
const s = require("../../helper/getSequence");
const userAuth = require("../middleware/userAuth");
const Review = require("../model/review");
const Read = require("../model/read");

//! Get

router.get("/", userAuth, (req, res) => {
  Review.aggregate([
    {
      $lookup: {
        from: "reads",
        localField: "read_id",
        foreignField: "id",
        as: "read",
      },
    },
    {
      $unwind: {
        path: "$read",
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "read.book_id",
        foreignField: "id",
        as: "book",
      },
    },
    {
      $unwind: {
        path: "$book",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "read.user_id",
        foreignField: "id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $project: {
        _id: 1,
        id: 1,
        rating: 1,
        comment: 1,
        date: 1,
        title: "$book.Title",
        name: "$user.name",
      },
    },
  ])
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Get Reviews",
        reviews: result,
      });
    });
});

router.get("/new", userAuth, (req, res) => {
  Review.find()
    .then((result) => {
      res.status(200).json({
        message: "Get Reviews",
        reviews: result.reverse(),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/user-book", userAuth, (req, res) => {
  Review.aggregate([
    {
      $lookup: {
        from: "reads",
        localField: "read_id",
        foreignField: "id",
        as: "read",
      },
    },
    {
      $unwind: {
        path: "$read",
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "read.book_id",
        foreignField: "id",
        as: "book",
      },
    },
    {
      $unwind: {
        path: "$book",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "read.user_id",
        foreignField: "id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $match: {
        $and: [{ "read.user_id": req.userData.id }],
      },
    },
    {
      $project: {
        _id: 1,
        id: 1,
        read_id: 1,
        rating: 1,
        comment: 1,
        date: 1,
        book: "$book.Title",
        user: "$user.name",
      },
    },
  ])
    //.match({ "read.user_id": req.userData.id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Get Reviews",
        reviews: result.reverse(),
      });
    });
});

router.post("/book-review", (req, res) => {
  Review.aggregate([
    {
      $lookup: {
        from: "reads",
        localField: "read_id",
        foreignField: "id",
        as: "read",
      },
    },
    {
      $unwind: {
        path: "$read",
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "read.book_id",
        foreignField: "id",
        as: "book",
      },
    },
    {
      $unwind: {
        path: "$book",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "read.user_id",
        foreignField: "id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $match: {
        $and: [
          {
            "read.book_id": req.body.bId,
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        id: 1,
        rating: 1,
        comment: 1,
        date: 1,
        book: "$book.Title",
        user: "$user.name",
      },
    },
  ])
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Get Reviews",
        reviews: result.reverse(),
      });
    });
});

router.post("/book-review-count", (req, res) => {
  let q = {
    "read.book_id": req.body.bId,
  };

  Review.aggregate()
    .lookup({
      from: "reads",
      localField: "read_id",
      foreignField: "id",
      as: "read",
    })
    .match(q)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Get Reviews",
        count: result.length,
      });
    });
});

router.post("/r", (req, res) => {
  let q = {
    id: req.body.rId,
  };

  Review.aggregate()
    .lookup({
      from: "reads",
      localField: "read_id",
      foreignField: "id",
      as: "read",
    })
    .match(q)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Get Reviews",
        reviews: result.reverse(),
      });
    });
});

//! Post

router.post("/add-review", userAuth, async (req, res) => {
  let read = await Read.find({ id: req.body.read_id });
  console.log(read);
  if (read.length > 0) {
    if (read[0].status === "C") {
      let seq = await s.getSequence("reviews");
      let ratings = req.body.rating;
      if (ratings > 5) {
        ratings = 5;
      }
      let review = new Review({
        _id: new mongoose.Types.ObjectId(),
        id: seq,
        read_id: req.body.read_id,
        rating: ratings,
        comment: req.body.comment,
        date: Date.now(),
      });
      console.log(review);

      review
        .save()
        .then((result) => {
          console.log(result);
          res.status(200).json({
            message: "Review Created",
            review: result,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    } else {
      res.status(409).json({ error: "First complete Readeing" });
    }
  } else {
    res.status(400).json({ error: "Read not Foind" });
  }
});

//!delete

router.delete("/delete/:id", userAuth, (req, res) => {
  Review.findOneAndDelete({ id: req.params.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Review Deleted",
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//!Patch
router.patch("/edit-review/:id", userAuth, (req, res) => {
  let ratings = req.body.rating;
  if (ratings > 5) {
    ratings = 5;
  }
  Review.findOneAndUpdate(
    { id: req.params.id },
    {
      rating: ratings,
      comment: req.body.comment,
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Review updated",
        result: result,
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
