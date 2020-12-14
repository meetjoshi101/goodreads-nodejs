const csv=require('csvtojson');

class rating{
    set bookId(book_id){
        this.book_id = book_id;
    }
    get bookId(){
        return this.book_id;
    }
    set userId(user_id){
        this.user_id = user_id;
    }
    get userId(){
        return this.user_id;
    }
    set Rating(rating){
        this.rating = rating;
    }
    get Rating(){
        return this.rating;
    }
    constructor(){
    }
};

const readRating = async function () {
    let userRating = [];
    await  csv()
            .fromFile('./CSV/Ratings.csv')
            .then((json)=>{
                let u;
                json.forEach((row)=>{
                    u=new rating();
                    Object.assign(u,row);
                    userRating.push(u);
                });
            });
    return userRating;
};

module.exports = {readRating};