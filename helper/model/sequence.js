
const mongoose = require('mongoose');

const SequenceSchema = mongoose.Schema({
  table: String,
  id: Number,
});

module.exports = mongoose.model("Sequence", SequenceSchema);