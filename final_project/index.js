const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req, res, next) {
    if (!req.session || !req.session.token) {
        return res.status(401).json({ message: 'Access denied. No session token provided.' });
    }

    const token = req.session.token;
    try {
        const decoded = jwt.verify(token, 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'); // Using the generated secret key
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid session token.' });
    }
 });

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));