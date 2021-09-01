process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("POST /", function () {
    test("can post book", async function () {
        let response = await request(app)
            .post("/books/")
            .send({
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            });

        expect(response.body).toEqual({
            "book": {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        });
    });

    test("cannot post book", async function () {
        let response = await request(app)
            .post("/books/")
            .send({
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "pages": "264",
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            });
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
            "error": {
                "message": [
                    "instance requires property \"language\"",
                    "instance.pages is not of a type(s) integer"
                ],
                "status": 400
            },
            "message": [
                "instance requires property \"language\"",
                "instance.pages is not of a type(s) integer"
            ]
        });
    });

    afterEach(async function () {
        await db.query("DELETE FROM books");
    });
});

describe("PUT/", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM books");

    });

    test("can update book", async function () {
        let testBook = await request(app)
            .post("/books/")
            .send({
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            });
        let response = await request(app)
            .put("/books/0691161518")
            .send({
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "spanish",
                "pages": 300,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            });

        expect(response.body).toEqual({
            "book": {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "spanish",
                "pages": 300,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        });
    });

    test("cannot update book", async function () {

        let testBook = await request(app)
            .post("/books/")
            .send({
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            });

        let response = await request(app)
            .put("/books/0691161518")
            .send({
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "pages": "string",
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            });
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual({
            "error": {
                "message": [
                    "instance requires property \"language\"",
                    "instance.pages is not of a type(s) integer"
                ],
                "status": 400
            },
            "message": [
                "instance requires property \"language\"",
                "instance.pages is not of a type(s) integer"
            ]
        });
    });
});

afterAll(async function () {
    await db.query("DELETE FROM books");
    await db.end();
});