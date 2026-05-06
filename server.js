    const express = require('express');
    const app = express();

    app.use(express.json());

    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./data.db');



    app.get('/', (req, res) => {
    res.send('Hello, server is working!');
    });



    app.listen(3000, () => {
    console.log('Server started on port 3000');
    });
    // table
    db.run(`
    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        genre TEXT,
        platform TEXT
    )
    `);


app.post('/api/games', (req, res) => {
    const { title, genre, platform } = req.body;

    // validation
    if (!title || !genre || !platform) {
        return res.status(400).send('Missing fields');
    }

    const sql = `INSERT INTO games (title, genre, platform) VALUES (?, ?, ?)`;

    db.run(sql, [title, genre, platform], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.status(201).json({
            id: this.lastID,
            title,
            genre,
            platform
        });
    });
});