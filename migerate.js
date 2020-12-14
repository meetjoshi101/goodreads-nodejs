/* eslint-disable no-unused-vars */
require("dotenv").config();
const mongoose = require("mongoose");
const readBooks = require("./readBooks");
const readGenres = require("./readGenres");
const s = require("./helper/getSequence");
const Genre = require("./api/model/genre");
const User = require("./api/model/user");
const Book = require("./api/model/book");
const Read = require("./api/model/read");
const Sequence = require("./helper/model/sequence");
const Review = require("./api/model/review");
const bcrypt = require("bcrypt");

//Db connection
const importBooks = async () => {
  let bookArr = await readBooks.readBook();
  console.log(bookArr[0]);
  Book.insertMany(bookArr, (err, doc) => {
    if (err) throw err;
    console.log(doc);
  });
};

const importGenre = async () => {
  let genresArr = await readGenres.readGenres();
  console.log(genresArr[0]);
  genresArr.forEach(async (val) => {
    await Genre.create(
      { _id: new mongoose.Types.ObjectId(), id: val.id, name: val.name },
      (err, doc) => {
        console.log(doc);
      }
    );
  });
};

const imporUser = async () => {
  let userArr = [];
  let myObj;
  let seq = await s.getSequence("reads");
  let hash = await bcrypt.hash("admin", 10);
  myObj = {
    id: seq,
    email: "admin@admin.com",
    password: hash,
    name: "Admin",
    genreList: [1],
    role: "A",
  };
  userArr.push(myObj);
  seq = await s.getSequence("reads");
  let hash1 = await bcrypt.hash("user", 10);
  myObj = {
    id: seq,
    email: "user@user.com",
    password: hash1,
    name: "user",
    genreList: [1],
    role: "U",
  };
  userArr.push(myObj);
  User.insertMany(userArr, (err, data) => {
    if (err) throw err;
    console.log(data);
  });
};

const importRead = async () => {
  let read;
  let seq;
  for (var i = 1; i <= 3; i++) {
    seq = await s.getSequence("reads");
    console.log(seq);
    if (i === 3) {
      read = new Read({
        _id: new mongoose.Types.ObjectId(),
        id: i,
        user_id: 1,
        book_id: i,
        status: "C",
      });
    } else {
      read = new Read({
        _id: new mongoose.Types.ObjectId(),
        id: i,
        user_id: 1,
        book_id: i,
        status: "R",
      });
    }
    await read.save().then((data) => console.log(data));
  }
};

const importReview = async () => {
  let seq = await s.getSequence("reviews");
  let review = new Review({
    _id: new mongoose.Types.ObjectId(),
    id: seq,
    read_id: 3,
    rating: 4.5,
    comment: "Very good",
    date: Date.now(),
  });

  await review.save().then((data) => console.log(data));
};

const correctSequence = async () => {
  let sequence = new Sequence({
    table: "books",
    id: 10000,
  });
  await sequence.save();
  sequence = new Sequence({
    table: "genres",
    id: 39,
  });
  await sequence.save();
  sequence = new Sequence({
    table: "users",
    id: 2,
  });
  await sequence.save();
  sequence = new Sequence({
    table: "reads",
    id: 2,
  });
  await sequence.save();
};

const exit = () => {
  mongoose.connection.close().then(_=> console.log("100% Complete!"));
};

const app = async () => {
  await mongoose.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.log(err);
      console.log("Database Connected");
    }
  );
  mongoose.Promise = global.Promise;

  console.log("Migeration Started");
  await importBooks();
  await importGenre();
  await imporUser();
  await importRead();
  await importReview();
  await correctSequence();
  await exit();
};

app();
