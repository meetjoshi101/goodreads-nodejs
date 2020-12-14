/* eslint-disable no-undef */
require("dotenv").config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');
const db = require('../db');

const token = 'B eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJBIiwiaWQiOjEsImlhdCI6MTYwNTE2NzgxNn0.dcPzwtKAY7ys4IyF35ofQa3PtJOGft2958D7lYciHZM';
let id;
describe('---Admin Api For Genres Only @ Admin can access---',()=>{
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

    it('Ok, Admin Add Genre',(done)=>{
        request(app).post('/genre/add-genre')
        .set('Authorization', token)
        .send({
            "name": "Monkey"
        })
        .expect(201)
        .end((err,res)=>{
            expect(res.body).to.have.property('genre');
            expect(res.body.genre).to.be.an('object');
            id = res.body.genre.id;
            done(err);
        });
    });

    it('Ok, All ready existing Genre cannot be added',(done)=>{
        request(app).post('/genre/add-genre')
        .set('Authorization', token)
        .send({
            "name": "Monkey"
        })
        .expect(409)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        });
    });

    it('Ok, Admin Delete genre',(done)=>{
        request(app).delete(`/genre/delete/${id}`)
        .set('Authorization', token)
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        })
    });

});

describe('General Api for Genres',()=>{
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

    it('Ok,Get Genre Returns Genre',(done)=>{
        request(app).get('/genre').expect(200)
        .end((err,res)=>{
            expect(res.body).to.be.an('object');
            done(err);
        });
    });
});
