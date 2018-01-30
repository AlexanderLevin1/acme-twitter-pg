const app = require('express').Router();

const db = require('../db');

app.get('/', (req, res, next) => {
    db.getTweets((err, tweets) => {
        if (err) return next(err);
        res.render('tweets', { title: 'Tweets', tweets: tweets })
    })
});

app.get('/:id', (req, res, next) => {
    db.getTweet(req.params.id, (err, tweet) => {
        const name = db.getUser(`${tweet.user_id}`, (err, user) => {
            if (err) return console.log(err);
            res.render('tweet', { title: `Tweet: ${user.name}`, user: user, tweet: tweet })
        });
    });
});

module.exports = app;