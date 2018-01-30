const pg = require('pg');

//what exactly?
const client = new pg.Client(process.env.DATABASE_URL);

client.connect();

const SQL_SYNC = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name varchar(255)
    );

    CREATE TABLE IF NOT EXISTS tweets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        content TEXT DEFAULT NULL
    );
`;

const SQL_SEED = `
    INSERT INTO users(name) values ('foo');
    INSERT INTO users(name) values ('barr');
    INSERT INTO users(name) values ('bazz');
    `

const sync = (cb) => {
    client.query(SQL_SYNC, cb);
}

    // why is there a cb?
const seed = (cb) => {
    client.query(SQL_SEED, cb);
};

const getUsers = (cb) => {
    client.query('SELECT * FROM users', (err, result) => {
        if(err) return cb(err);
        console.log(`results ${result.rows}`)
        cb(null, result.rows);
    })
};

const getUser = (id, cb) => {
    client.query('SELECT * FROM users WHERE id =$1', [ id ], (err, result) =>{
        if(err) return cb(err);
        console.log(`Person: ${results.length}`)
        cb(null, result.rows.length ? result.rows[0] : null);
    })
};

const getUserTweets = (id, cb) => {
    client.query('SELECT content FROM tweets WHERE user_id = $1 ', [ id ], (err, result) => {
        if(err) return cb(err)
        console.log(result)
        cb(null, result.rows)
    })
};

const getTweets = (cb) => {
    client.query('SELECT * FROM tweets', (err, result) => {
        if(err) return cb(err)
        cb(null, result.rows)
    })
};

const getTweet = (id, cb) => {
    client.query ('SELECT * FROM tweets WHERE id = $1 ', [id], (err, result) => {
        if(err) return cb(err)
        cb(null, result.rows ? result.rows[0] : null)
    })
}

// must export!!
module.exports  ={
    sync,
    seed,
    getUsers,
    getUser,
    getUserTweets,
    getTweets,
    getTweet
};