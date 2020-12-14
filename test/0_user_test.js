/* eslint-disable no-undef */
require("dotenv").config();
process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');
const db = require('../db');

const token = 'B eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJBIiwiaWQiOjEsImlhdCI6MTYwNTE2NzgxNn0.dcPzwtKAY7ys4IyF35ofQa3PtJOGft2958D7lYciHZM';

describe('Genrel Api For User',()=>{
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

    it('Ok,User Can Login and recives Token',(done)=>{
        request(app).post('/user/login')
        .send({
            "email" : "admin@admin.com",
            "password": "admin"
        }).expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('token');
            done(err);
        });
    });

    it('Ok,Non Registered User Cannot Login',(done)=>{
        request(app).post('/user/login')
        .send({
            "email" : "monkey@monkey.com",
            "password": "meet"
        }).expect(401)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        });
    });

    it('Ok,Incorrect Password can be dected',(done)=>{
        request(app).post('/user/login')
        .send({
            "email" : "meet@meet.com",
            "password": "lol"
        }).expect(401)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        });
    });

    it('Ok,User Can Signup and recives Token',(done)=>{
        request(app).post('/user/signup')
        .send({
            "email" : "monkey@monkey.com",
            "password": "monkey",
            "genreList": [1,2]
        }).expect(201)
        .end((err,res)=>{
            expect(res.body).to.have.property('token');
            done(err);
        });
    });

    it('Ok,Existing User Cannot Signup',(done)=>{
        request(app).post('/user/signup')
        .send({
            "email" : "monkey@monkey.com",
            "password": "monkey",
            "genreList": [1,2]
        }).expect(409)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        });
    });


});

describe('---Admin Api For User Only @ admin can access it ---',()=>{
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

    it('Ok,Admin add other Admin',(done)=>{
        request(app).patch('/user/admin-user/monkey@monkey.com')
        .set('Authorization', token).expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        });
    });

    it('Ok,Admin Delete User',(done)=>{
        request(app).delete('/user/monkey@monkey.com')
        .set('Authorization', token).expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('message');
            done(err);
        });
    });


    it('OK, Admin get all users',(done)=>{
        request(app).get('/user/users').set('Authorization', token)
        .expect(200)
        .end((err,res)=>{
            expect(res.body).to.have.property('Users');
            expect(res.body.Users).to.be.an('array');
            done(err);
        });
    });
});
