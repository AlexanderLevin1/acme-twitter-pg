const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const nunjucks = require('nunjucks');
nunjucks.configure({ noCache: true });

app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.use((req, res, next) => {
    res.locals.path = req.url;
    next();
});

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Twitter Clone' })
});

app.get('/tweets', require('./routes/tweets'));

db.sync((err) => {
    if (err) return console.log(err);
    db.getUsers((err, users) => {
        if (err) return console.log(err);
        console.log(`there are ${users.length} users`);
        db.getUserTweets(2, (err, userTweets) => {
            if (err) return console.log(err)
            console.log(`Tweets from user 2 are ${userTweets[0]} *`)
        });
        db.getTweets((err, tweets) => {
            if (err) return console.log(err);
            console.log(`Tweets ${tweets} `);
        })
    })

});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));