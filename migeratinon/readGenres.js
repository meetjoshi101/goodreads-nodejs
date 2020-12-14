const csv=require('csvtojson');

class genres{
    //bookid
    set Id(id){
        this.id = id;
    }
    get Id(){
        return this.id;
    }
    //book publication
    set Name(name){
        this.name = name;
    }
    get Name(){
        return this.name;
    } 
    constructor(){

    }
}
const readGenres = async function () {
    let genresArray = [];
    await csv()
            .fromFile('./CSV/genres.csv')
            .then((json)=>{
                let g;
                json.forEach((row)=>{
                    g=new genres();
                    Object.assign(g,row);
                    genresArray.push(g);
                });
            });
    return genresArray;
}
module.exports = {readGenres};