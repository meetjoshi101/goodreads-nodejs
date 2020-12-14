const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: { type: Number, require: true },
  name: { type: String, require: true },
});

module.exports = mongoose.model("Genre", genreSchema);
