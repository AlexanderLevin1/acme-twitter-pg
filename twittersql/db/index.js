const pg = require('pg');

//what exactly?
const client = new pg.Client(process.env.DATABASE_URL);

client.connect();
//now we have a connection!

const SQL_SYNC = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        name varchar(255)
    );
`;

const SQL_SEED = `
    INSERT INTO users(name) values ('foo');
    INSERT INTO users(name) values ('barr');
    INSERT INTO users(name) values ('bazz');
    `
// why is there a cb?
const seed = (cb) => {
    client.query(SQL_SEED, cb);
};

const sync = (cb) => {
    client.query(SQL_SYNC, cb);
}

const getUsers = (cb) => {
    client.query('SELECT * FROM users', (err, result) => {
        if(err) return cb(err);
        cb(null, result.rows);
    })
}

const getUser = (id, cb) => {
    client.query('SELECT * FROM users WHERE id =$1', [id], (err, result) =>{
        if(err) return cb(err);
        //****Why? 
        cb(null, result.rows.length ? result.rows[0] : null);
    })
}

// must export!!
module.exports  ={
    sync,
    getUsers,
    getUser,
    seed
}