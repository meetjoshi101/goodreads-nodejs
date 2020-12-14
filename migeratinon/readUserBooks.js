const csv=require('csvtojson');
class UserBooks{
    set userId(user_id){
        this.user_id = user_id;
    }
    get userId(){
        return this.user_id;
    }
    set bookId(book_id){
        this.book_id = book_id;
    }
    get bookId(){
        return this.book_id;
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

const readUserBook = async function () {
    let userBookArray = [];
    await  csv()
            .fromFile('./CSV/to_read.csv')
            .then((json)=>{
                let u;
                json.forEach((row)=>{
                    u=new UserBooks();
                    Object.assign(u,row);
                    userBookArray.push(u);
                });
            });
    return userBookArray;
};

module.exports = {readUserBook};