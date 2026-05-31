const express = require('express');
const app = express();

// Set EJS as template engine
app.set('view engine', 'ejs');

// Allow reading form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// HOME ROUTE
app.get('/', (req, res) => {
    res.render('index');
});

// CONTACT FORM ROUTE
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    res.render('thankyou', { name, email, message });
});

// Start server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});