const { Client } = require('pg');

const dbConfig = {
    user: 'greenjets',
    password: '123',
    // host: '193.123.95.122',
    host: '84.235.242.14',
    port: '5432',
    database: 'greenjets',
};

const client = new Client(dbConfig);

client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');


    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err);
    });

module.exports = client;
