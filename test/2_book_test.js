/* eslint-disable no-undef */
require("dotenv").config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');
const db = require('../db');

const token = 'B eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJBIiwiaWQiOjEsImlhdCI6MTYwNTE2NzgxNn0.dcPzwtKAY7ys4IyF35ofQa3PtJOGft2958D7lYciHZM';



describe('Genrel Api For Books',()=>{
    before((done)=>{
        db.connect()
        .then(()=>done())
        .catch(err=>done(err));
    });

    after((done) => {
        db.close()
          .then(() => done())
          .catch((err) => done(err));
    });

    it('Ok, Get Books Returns All Books',(done)=>{
        request(app).get('/book/')
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('book');
            expect(res.body.book).to.be.an('array');
            done(err);
        });
    });

    it('Ok, Get Book By ISBN Returns Single Book',(done)=>{
        request(app).get('/book/isbn/195153448')
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('book');
            expect(res.body.book).to.be.an('array')
            .that.have.lengthOf(1);
            done(err);
        });
    });

    it('Ok, Get Book By ID Returns Single Book',(done)=>{
        request(app).get('/book/id/1')
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('book');
            expect(res.body.book).to.be.an('array');
            done(err);
        });
    });

    it('Ok, Get Book By Author Returns Book',(done)=>{
        request(app).post('/book/author/')
        .send({
            "name":"Meet Joshi"
        })
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('book');
            expect(res.body.book).to.be.an('array');
            done(err);
        });
    });

    it('Ok, Get Book By Title Returns Book',(done)=>{
        request(app).post('/book/title/')
        .send({
            "title":"Harry Potter and the Sorcerer's Stone (Harry Potter, #1)"
        })
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('book');
            expect(res.body.book).to.be.an('array');
            done(err);
        });
    });

    it('Ok, Search Book By Title,ISBN,Author Returns Book Array',(done)=>{
        request(app).post('/book/search/')
        .send({
            "s":"Harry Potter and the Sorcerer's Stone (Harry Potter, #1)"
        })
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('result');
            expect(res.body.result).to.be.an('array');
            done(err);
        });
    });

    it('Ok, Get Book By Grenre Returns Book',(done)=>{
        request(app).post('/book/genre')
        .send({
            "Genre_id":"1"
        })
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('book');
            expect(res.body.book).to.be.an('array');
            done(err);
        });
    });


});

describe('---Admin Api For Books Only @ Admin can access---',()=>{
    before((done)=>{
        db.connect()
        .then(()=>done())
        .catch(err=>done(err));
    });

    after((done) => {
        db.close()
          .then(() => done())
          .catch((err) => done(err));
    });

    it('Ok, Admin Add Book',(done)=>{
        request(app).post('/book/add-book')
        .set('Authorization', token)
        .send({
            "Gener_id":5,
            "ISBN": "008",
            "publication_Year":2020,
            "Author": "Meet Joshi",
            "Title": "Complex Reality",
            "AvgRating": 4.5,
            "Image_url": "www.google.com",
            "Image_URL_S": "www.google.com"
        })
        .expect(201)
        .end((err,res)=>{
            expect(res.body).to.have.property('Book');
            expect(res.body.Book).to.be.an('object');
            done(err);
        });
    });

    it('Ok, All ready existing Book cannot be added',(done)=>{
        request(app).post('/book/add-book')
        .set('Authorization', token)
        .send({
            "Gener_id":5,
            "ISBN": "008",
            "publication_Year":2020,
            "Author": "Meet Joshi",
            "Title": "Complex Reality",
            "AvgRating": 4.5,
            "Image_url": "www.google.com",
            "Image_URL_S": "www.google.com"
        })
        .expect(409)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        });
    });

    it('Ok, Admin Update Book',(done)=>{
        request(app).patch('/book/edit-book')
        .set('Authorization', token)
        .send({
            "Gener_id":5,
            "ISBN": "008",
            "publication_Year":2020,
            "Author": "Meet R Joshi",
            "Title": "Complex Reality of life",
            "AvgRating": 5.0,
            "Image_url": "www.google.com",
            "Image_URL_S": "www.google.com"
        })
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        });
    });

    it('Ok, Admin Delete Book',(done)=>{
        request(app).delete('/book/delete/isbn/008')
        .set('Authorization', token)
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        })
    });

});
