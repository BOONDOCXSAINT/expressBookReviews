const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    // Check if username and password match the one we have in records
    return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username }, 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', { expiresIn: '1h' }); // Using the generated secret key
    req.session.token = token;
    return res.status(200).json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.user.username; // Assuming the username is stored in the session

    const book = books.find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.reviews) {
        book.reviews = {};
    }

    book.reviews[username] = review;
    return res.status(200).json({ message: 'Review added/modified successfully', reviews: book.reviews });
 });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
