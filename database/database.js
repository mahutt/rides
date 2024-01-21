var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(
    './database/rides.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the SQLite database.');
    }
);
module.exports = db;
