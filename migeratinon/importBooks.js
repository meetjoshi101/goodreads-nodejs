require('dotenv').config();
const readBooks = require('./readBooks');
const mdb = require('mongodb').MongoClient;

const app = async () => {
    let bookArr = await readBooks.readBook();
    mdb.connect(process.env.MONGODB_URI, function(err,dbo){
        if (err){
            throw err;
        } 
        let db = dbo.db('goodreads')
            db.collection('books').insertMany(bookArr,function(err,res){
                if(err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);
                dbo.close();
            });
    });
}

app();