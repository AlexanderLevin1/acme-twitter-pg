const express = require('express');
const app = express();
const path = require('path');
const nunjucks = require('nunjucks');
nunjucks.configure ({ noCache: true });

const db = require('./db');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.use((req, res, next) => {
    res.locals.path = req.url;
    next();
});

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Home' })
});

app.use('/users', require('./routes/users'));

db.sync((err) => {
    if (err) return console.log(err);
    db.getUsers((err, users) => { 
        if (err) return console.log(err);
        console.log(`there are ${users.length} users`);
        db.seed((err) => {
            if (err) return console.log(err);
            db.getUsers((err, users) => {
                if(err) return console.log(err);
                console.log(`there are ${users.length} users`);
                db.getUser(2, (err, user) => {
                    if(err) return console.log(err);
                    console.log(`user with an id of 2 is ${user.name}`);
                })
            })
        })
    })

});