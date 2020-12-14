const csv = require("csvtojson");

class Books {
  // id
  set Id(id) {
    this.id = id;
  }
  get Id() {
    return this.id;
  }
  //book publication
  set publicationYear(publication_Year) {
    this.publication_Year = publication_Year;
  }
  get publicationYear() {
    return this.publication_Year;
  }
  //author
  set author(Author) {
    this.Author = Author;
  }
  get author() {
    return this.Author;
  }
  //title
  set title(Title) {
    this.Title = Title;
  }
  get title() {
    return this.Title;
  }
  //avg rating
  set avgRating(AvgRating) {
    this.AvgRating = AvgRating;
  }
  get avgRating() {
    return this.AvgRating;
  }
  //img url
  set imageUrl(Image_url) {
    this.Image_url = Image_url;
  }
  get imageUrl() {
    return this.Image_url;
  }
  //img urls
  set imageUrls(Image_URL_S) {
    this.Image_URL_S = Image_URL_S;
  }
  get imageUrls() {
    return this.Image_URL_S;
  }

  constructor() {}
}
const readBook = async function () {
  let bookArray = [];
  await csv()
    .fromFile("./CSV/Books.csv")
    .then((json) => {
      let b;
      json.forEach((row) => {
        b = new Books();
        Object.assign(b, row);
        bookArray.push(b);
      });
    });
  return bookArray;
};

const app = async () => {
  let bookarr = await readBook();
  console.log(bookarr);
};

app();

module.exports = { readBook };
