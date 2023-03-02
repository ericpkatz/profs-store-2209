const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/my_acme_store_db');

module.exports = client;
