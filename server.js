const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');
const express = require('express');
const app = express();


app.get('/', (req, res) => {
   res.send('Hello, server is working!');
});


app.listen(3000, () => {
   console.log('Server started on port 3000');
});

db.run(`
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    genre TEXT,
    platform TEXT
)
`);

