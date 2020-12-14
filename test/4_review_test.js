/* eslint-disable no-undef */
require("dotenv").config();
process.env.NODE_ENV = 'test';
const expect = require("chai").expect;
const request = require("supertest");

const app = require("../app");
const db = require("../db");

const token = 'B eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJBIiwiaWQiOjEsImlhdCI6MTYwNTE2NzgxNn0.dcPzwtKAY7ys4IyF35ofQa3PtJOGft2958D7lYciHZM';
let id;
describe("Review Apis, Only Logined User Can access only", () => {
  before((done) => {
    db.connect()
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    db.close()
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Ok,Latest Review Returns Review array", (done) => {
    request(app)
      .get("/review/new")
      .set("Authorization", token)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty("reviews");
        done(err);
      });
  });

  it("Ok,User Review Returns Review array", (done) => {
    request(app)
      .get("/review/user-book")
      .set("Authorization", token)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty("reviews");
        done(err);
      });
  });

  it("Ok,Book Review Returns Review array", (done) => {
    request(app)
      .post("/review/book-review")
      .set("Authorization", token)
      .send({
        bId: 3,
      })
      .expect(200)
      .end((err, res) => {
        id = res.body.reviews[0].id;
        expect(res.body).to.haveOwnProperty("reviews");
        done(err);
      });
  });

  it("Ok,Book Review count Returns Number", (done) => {
    request(app)
      .post("/review/book-review-count")
      .set("Authorization", token)
      .send({
        bId: 3,
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty("count");
        done(err);
      });
  });

  it("Ok,Single Review Returns single Review in array", (done) => {
    request(app)
      .post("/review/r")
      .set("Authorization", token)
      .send({
        rId: id,
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty("reviews");
        done(err);
      });
  });

  it("ok,Review can be added", (done) => {
    request(app)
      .post("/review/add-review")
      .set("Authorization", token)
      .send({
        read_id: 3,
        rating: 5,
        comment: "Very Good",
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty("review");
        id = res.body.review.id;
        done(err);
      });
  });

  it("ok,If Read Not found then Review can not be added", (done) => {
    request(app)
      .post("/review/add-review")
      .set("Authorization", token)
      .send({
        read_id: 5,
        rating: 5,
        comment: "Very Good",
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty("error");
        done(err);
      });
  });

  it("ok,If Read Not Complete then Review can not be added", (done) => {
    request(app)
      .post("/review/add-review")
      .set("Authorization", token)
      .send({
        read_id: 1,
        rating: 5,
        comment: "Very Good",
      })
      .expect(409)
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty("error");
        done(err);
      });
  });

  it("ok,Review can be edited", (done) => {
    request(app)
      .patch(`/review/edit-review/${id}`)
      .set("Authorization", token)
      .send({
        rating: 4,
        comment: "Very Good",
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty("result");
        done(err);
      });
  });

  it("ok,Review can be deleted", (done) => {
    request(app)
      .delete(`/review/delete/${id}`)
      .set("Authorization", token)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.haveOwnProperty("result");
        done(err);
      });
  });
});
