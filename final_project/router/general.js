const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    users.push({ username, password });
    return res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://your-api-endpoint/books'); // Replace with your actual API endpoint
        const booksList = response.data;
        res.status(200).json(booksList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books list' });
    }
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://your-api-endpoint/books/isbn/${isbn}`); // Replace with your actual API endpoint
        const bookDetails = response.data;
        res.status(200).json(bookDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details' });
    }
});

// Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://your-api-endpoint/books/author/${author}`); // Replace with your actual API endpoint
        const booksByAuthor = response.data;
        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books by author' });
    }
});

// Get book details based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://your-api-endpoint/books/title/${title}`); // Replace with your actual API endpoint
        const bookDetails = response.data;
        res.status(200).json(bookDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details' });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books.find(book => book.isbn === isbn);
    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: 'Reviews not found' });
    }
});

module.exports.general = public_users;
