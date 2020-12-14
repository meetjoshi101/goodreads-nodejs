require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const connect = async () => {
  MongoClient.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // eslint-disable-next-line no-unused-vars
  }).then((db, err) => {
    var dbo = db.db("goodreads");
    dbo
      .collection("books")
      .createIndex({ Author: "text", Title: "text", ISBN: "text" })
      .then((result) => {
        console.log("Create Index Compete");
        console.log(result);
        db.close();
      })
      .catch((err) => {
        console.log(err);
        db.close();
      });
  });
};
connect();
