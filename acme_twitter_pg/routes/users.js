const app = require('express').Router();

const db = require('../db');

app.get('/', (req, res, next) => {
    db.getUsers((err, users) => {
        if(err) return next(err);
        res.send(users)
    })
});

app.get('/:id', (req, res, next) => {
    db.getUser(req.params.id, (err, user) =>{
        if(err) return next(err);
        res.send(user);
    })
});

module.exports = app;