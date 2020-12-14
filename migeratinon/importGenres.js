require('dotenv').config();
const readGenres = require('./readGenres');
const mdb = require('mongodb').MongoClient;
const app = async () => {
    let genresArr = await readGenres.readGenres();
    mdb.connect(process.env.MONGODB_URI, function(err,dbo){
        if (err){
            throw err;
        } 
        let db = dbo.db('goodreads')
            db.collection('genres').insertMany(genresArr,function(err,res){
                if(err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);
                dbo.close();
            });
         
    });
};
app();