const readUserBook = require('./readUserBooks');
require('dotenv').config();
const faker = require('faker');
const ObjectsToCsv = require('objects-to-csv');
const mdb = require('mongodb').MongoClient;

const app = async()=>{
    let count = 1;
    let toread,review;
    let toReadArr=[];
    let reviewArr = [];
    let userBook = await readUserBook.readUserBook();
    let sDate,eDate;
    userBook.forEach((val) => {
        toread = {
            read_id: count,
            user_id: val.userId,
            book_id: val.bookId,
            statur:'Read'
        };
        sDate = faker.date.between('1998/01/01','2020/12/31');
        eDate = faker.date.between(sDate,'2020/12/31');
        review = {
            review_id: count,
            read_id: count,
            rating: val.Rating,
            review: faker.lorem.paragraph(),
            start_date: sDate,
            end_Date:eDate
        }
        toReadArr.push(toread);
        reviewArr.push(review);
        count++;
    });
    console.log("data Created!");
    console.log("db Started");

    mdb.connect(process.env.MONGODB_URI, function(err,dbo){
        if (err){
            throw err;
        } 
        let db = dbo.db('goodreads')
            db.collection('to_read').insertMany(toReadArr,function(err,res){
                if(err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);
                dbo.close();
            });
    });
    mdb.connect(process.env.MONGODB_URI, function(err,dbo){
        if (err){
            throw err;
        } 
        let db = dbo.db('goodreads')
            db.collection('review').insertMany(reviewArr,function(err,res){
                if(err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);
                dbo.close();
            });
    });
    console.log("db finsh");
};
app();