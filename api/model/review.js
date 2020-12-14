const mongoose = require("mongoose");
const Read = require("../model/read");
const reviewSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: { type: Number, require: true, unique: true },
  read_id: { type: Number, require: true, ref: "Read" },
  rating: { type: Number, require: true },
  comment: { type: String, require: true },
  date: { type: Date, require: true },
});

module.exports = mongoose.model("Review", reviewSchema);
