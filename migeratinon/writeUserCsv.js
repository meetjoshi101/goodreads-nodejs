require('dotenv').config();
const faker = require('faker');
const ObjectsToCsv = require('objects-to-csv');
const mdb = require('mongodb').MongoClient;

const app = async() => {
    let userArr = [];
    let myObj;
    for(let i = 1; i<=53424;i++){
        myObj = {
                user_id: i,
                email: faker.internet.email(),
                password: faker.internet.password(),
                name: faker.name.findName(),
                genreList:[1]
        }
        userArr.push(myObj);
    }
    console.log(userArr);
    const csv = new ObjectsToCsv(userArr);

    await csv.toDisk('./CSV/Users.csv');
    console.log("csv created");


    mdb.connect(process.env.MONGODB_URI, function(err,dbo){
        if (err){
            throw err;
        } 
        let db = dbo.db('goodreads')
            db.collection('user').insertMany(userArr,function(err,res){
                if(err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);
                dbo.close();
            });
         
    });
}

app();
