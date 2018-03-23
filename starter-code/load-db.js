'use strict';

const pg = require('pg');
const Client = pg.Client;
const fs = require('fs');
const util = require('util');
const promisify = util.promisify;
const readFile = promisify(fs.readFile);

const DATABASE_URL = 'postgres://localhost:5432/demo';
const client = new Client(DATABASE_URL);
client.connect();
client.on('error', err => {
    console.error(err);
});

loadDB()
    .then(() => console.log('loadDB successful'))
    .catch(err => console.error(err))
    .then(() => client.end());

function loadDB() {
    return Promise.all([
        client.query(`
            CREATE TABLE IF NOT EXISTS
            authors (
                author_id SERIAL PRIMARY KEY,
                author VARCHAR(255) UNIQUE NOT NULL,
                author_url VARCHAR (255)
            );
        `),
        client.query(`
            CREATE TABLE IF NOT EXISTS
            articles (
                article_id SERIAL PRIMARY KEY,
                author_id INTEGER NOT NULL REFERENCES authors(author_id),
                title VARCHAR(255) NOT NULL,
                category VARCHAR(20),
                published_on DATE,
                body TEXT NOT NULL
            );
        `)
    ])
        .then(() => loadAuthors())
        .then(() => loadArticles());
}

function loadAuthors() {
    return loadIfNoRows(
        'authors',
        `INSERT INTO authors(author, author_url) 
        VALUES($1, $2) 
        ON CONFLICT DO NOTHING;`,
        article => [article.author, article.authorUrl]
    );
}

function loadArticles() {
    return loadIfNoRows(
        'articles',
        `INSERT INTO
        articles(author_id, title, category, published_on, body)
        SELECT author_id, $1, $2, $3, $4
        FROM authors
        WHERE author=$5;`,
        article => [article.title, article.category, article.publishedOn, article.body, article.author]
    );
}

function readHackerIpsum() {
    return readFile('./public/data/hackerIpsum.json', 'utf8')
        .then(json => JSON.parse(json));
}

function loadIfNoRows(table, insertSql, values) {
    return client.query(`SELECT COUNT(*) FROM ${table};`)
        .then(result => {
            if(parseInt(result.rows[0].count)) return;

            return readHackerIpsum()
                .then(articles => {
                    return Promise.all(
                        articles.map(article => {
                            return client.query(
                                insertSql,
                                values(article)
                            );
                        })
                    );
                });
        });
}