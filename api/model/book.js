const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: { type: Number, require: true },
  Gener_id: { type: Number, require: true },
  ISBN: { type: String, require: true },
  publication_Year: { type: Number, require: true },
  Author: { type: String, require: true },
  Title: { type: String, require: true },
  AvgRating: { type: Number, require: true },
  Image_url: { type: String, require: true },
  Image_URL_S: { type: String, require: true },
});

bookSchema.index({ "$***": "text" });

module.exports = mongoose.model("book", bookSchema);
