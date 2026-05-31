// Load required packages
const express = require('express');
const app = express();

// Set EJS as our template engine
app.set('view engine', 'ejs');

// Allow reading form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static('public'));

// HOME ROUTE - shows the form
app.get('/', (req, res) => {
    res.render('index');
});

// FORM SUBMIT ROUTE - handles form data
app.post('/submit', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    
    res.render('result', { name, email, message });
});

// Start server on port 3000
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});