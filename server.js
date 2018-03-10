'use strict';

/* Environment variables */
const PORT = process.env.PORT || 3000;
// TODOne: Don't forget to set your own conString!
const DATABASE_URL = 'postgres://localhost:5432/kilovolt';

/* Required Dependencies */
const pg = require('pg');
const express = require('express');
const app = express();

/* DB Connection */
const client = new pg.Client(DATABASE_URL);
client.connect();
client.on('error', err => {
    console.error(err);
});

/* Express Middleware */
// body parsers:
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// serve static assets:
app.use(express.static('./public'));


/** Data API Routes **/
app.get('/new', (request, response) => {
    response.sendFile('new.html', {root: './public'});
});

// (R)ead list of articles
app.get('/articles', (request, response) => {
    client.query(`
        SELECT *, 
            articles.published_on as "publishedOn",
            authors.author_url as "authorUrl"
        FROM articles
        INNER JOIN authors
        ON articles.author_id=authors.author_id;
    `)
        .then(result => response.send(result.rows))
        .catch(console.error);
});

// (C)reate new article, and possibly author
app.post('/articles', (request, response) => {
    const body = request.body;

    resolveAuthor(body.author, body.authorUrl)
        .then(author_id => {
            return client.query(`
                INSERT INTO
                articles(author_id, title, category, published_on, body)
                VALUES ($1, $2, $3, $4, $5);
            `,
            [
                author_id,
                body.title,
                body.category,
                body.publishedOn,
                body.body
            ]);
        })
        .then(() => {
            response.send('insert complete');
        })
        .catch(console.error);
});

// helper function to read or create author based on name
function resolveAuthor(author, authorUrl) {
    return client.query(
        `SELECT author_id FROM authors WHERE author=$1`,
        [author]
    )
        .then(result => {
            if(result.rows.length > 0) return result;

            return client.query(`
                INSERT INTO authors(author, author_url) 
                VALUES($1, $2)
                RETURNING author_id
            `,
            [author, authorUrl]
            );
        })
        .then(result => result.rows[0].author_id);
}

// (U)pdate article (and author)
app.put('/articles/:id', (request, response) => {
    const body = request.body;
    const params = request.params;

    Promise.all([
        client.query(`
            UPDATE authors
            SET author=$1, author_url=$2
            WHERE author_id=$3
        `,
        [
            body.author,
            body.authorUrl,
            body.author_id
        ]),

        client.query(`
                UPDATE articles
                SET author_id=$1, title=$2, category=$3, published_on=$4, body=$5
                WHERE article_id=$6
        `,
        [
            body.author_id,
            body.title,
            body.category,
            body.publishedOn,
            body.body,
            params.id
        ])
    ])
        .then(() => response.send('Update complete'))
        .catch(console.error);
});

// (D)estroy an article
app.delete('/articles/:id', (request, response) => {
    client.query(
        `DELETE FROM articles WHERE article_id=$1;`,
        [request.params.id]
    )
        .then(() => response.send('Delete complete'))
        .catch(console.error);
});

// (D)estroy ALL articles
app.delete('/articles', (request, response) => {
    client.query(
        `DELETE FROM articles`
    )
        .then(() => response.send('Full Delete Complete'))
        .catch(console.error);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
});