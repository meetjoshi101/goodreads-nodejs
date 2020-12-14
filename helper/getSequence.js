/* eslint-disable no-unused-vars */
const Sequence = require('./model/sequence');

exports.getSequence = async (table,id) => {
  let seq = await Sequence.findOne({ table });
  if (!seq) {
    seq = new Sequence({ table, id: 0 });
    await seq.save();
  }
  seq.id = seq.id + 1;
  await seq.save();
  return seq.id;
};
