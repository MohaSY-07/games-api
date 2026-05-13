const express = require('express');
const app = express();

app.use(express.json());

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');


// Create table
db.run(`
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    genre TEXT,
    platform TEXT
)
`);


// Home route
app.get('/', (req, res) => {
    res.send('Hello, server is working!');
});


// Create game
app.post('/api/games', (req, res) => {

    const { title, genre, platform } = req.body;

    if (!title || !genre || !platform) {
        return res.status(400).send('Missing fields');
    }

    const sql = `
    INSERT INTO games (title, genre, platform)
    VALUES (?, ?, ?)
    `;

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


// Get all games
app.get('/api/games', (req, res) => {

    const genre = req.query.genre;

    let sql = 'SELECT * FROM games';
    let params = [];

    if (genre) {
        sql += ' WHERE genre = ?';
        params.push(genre);
    }

    db.all(sql, params, (err, rows) => {

        if (err) {
            return res.status(500).send(err.message);
        }

        res.json(rows);

    });

});


// Get game by id
app.get('/api/games/:id', (req, res) => {

    const id = req.params.id;

    db.get('SELECT * FROM games WHERE id = ?', [id], (err, row) => {

        if (err) {
            return res.status(500).send(err.message);
        }

        if (!row) {
            return res.status(404).send('Game not found');
        }

        res.json(row);

    });

});


// Update game
app.put('/api/games/:id', (req, res) => {

    const id = req.params.id;

    const { title, genre, platform } = req.body;

    if (!title || !genre || !platform) {
        return res.status(400).send('Missing fields');
    }

    const sql = `
    UPDATE games
    SET title = ?, genre = ?, platform = ?
    WHERE id = ?
    `;

    db.run(sql, [title, genre, platform, id], function(err) {

        if (err) {
            return res.status(500).send(err.message);
        }

        if (this.changes === 0) {
            return res.status(404).send('Game not found');
        }

        res.send('Game updated');

    });

});


// Delete game
app.delete('/api/games/:id', (req, res) => {

    const id = req.params.id;

    db.run('DELETE FROM games WHERE id = ?', [id], function(err) {

        if (err) {
            return res.status(500).send(err.message);
        }

        if (this.changes === 0) {
            return res.status(404).send('Game not found');
        }

        res.send('Game deleted');

    });

});


// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
}); 