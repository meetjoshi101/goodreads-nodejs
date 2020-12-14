const mongoose = require("mongoose");
const DB_URI = process.env.MONGODB_URL;

function connect() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then((res, err) => {
        if (err) return reject(err);
        resolve();
      });
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
