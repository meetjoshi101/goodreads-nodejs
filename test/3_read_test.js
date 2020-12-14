/* eslint-disable no-undef */
require("dotenv").config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');
const db = require('../db');

const token = 'B eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJBIiwiaWQiOjEsImlhdCI6MTYwNTE2NzgxNn0.dcPzwtKAY7ys4IyF35ofQa3PtJOGft2958D7lYciHZM';
let id;
describe('Read Apis This api can be accessed by logined user only',()=>{
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

    it('Ok,Read can be created', (done)=>{
        request(app).post('/read/add-read')
        .set('Authorization', token)
        .send({
            "book_id":1
        })
        .expect(201)
        .end((err,res)=>{
            expect(res.body).to.have.property('read');
            expect(res.body.read).to.have.property('id');
            id = res.body.read.id
            console.log(id);
            console.log(err);
            done(err);
        });
    });

    it('Ok,Dulicate Read cannot be created', (done)=>{
        request(app).post('/read/add-read')
        .set('Authorization', token)
        .send({
            "book_id":1
        })
        .expect(409)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            console.log(err);
            done(err);
        });
    });

    it('Ok,Status can be changed', (done)=>{
        request(app).patch('/read/read-complete')
        .set('Authorization', token)
        .send({
            "id":id
        })
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            console.log(err);
            done(err);
        });
    });
    it('Ok,Read Can be Deleted', (done)=>{
        request(app).delete(`/read/delete/${id}`)
        .set('Authorization', token)
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        });
    })
});
