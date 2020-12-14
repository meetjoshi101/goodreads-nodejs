const mongoose = require("mongoose");

const readSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: { type: Number, require: true, unique: true },
  user_id: { type: Number, require: true },
  book_id: { type: Number, require: true },
  status: { type: String, require: true },
});

module.exports = mongoose.model("Read", readSchema);
