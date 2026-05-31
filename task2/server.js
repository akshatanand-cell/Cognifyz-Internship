const express = require('express');
const app = express();

// Set EJS as template engine
app.set('view engine', 'ejs');

// Allow reading form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Temporary storage for submissions
let submissions = [];

// HOME ROUTE
app.get('/', (req, res) => {
    res.render('index');
});

// SUBMIT ROUTE with server-side validation
app.post('/submit', (req, res) => {
    const { name, email, phone, age, password } = req.body;
    let errors = [];

    // Server-side validation
    if (!name || name.length < 3) {
        errors.push('Name must be at least 3 characters');
    }

    if (!email || !email.includes('@')) {
        errors.push('Please enter a valid email');
    }

    if (!phone || phone.length !== 10 || isNaN(phone)) {
        errors.push('Phone must be exactly 10 digits');
    }

    if (!age || age < 18 || age > 100) {
        errors.push('Age must be between 18 and 100');
    }

    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    // If errors found send back to form
    if (errors.length > 0) {
        return res.render('index', { errors });
    }

    // Store valid data temporarily
    submissions.push({ name, email, phone, age });

    // Show success page
    res.render('result', { name, email, phone, age });
});

// VIEW ALL SUBMISSIONS
app.get('/submissions', (req, res) => {
    res.render('submissions', { submissions });
});

// Start server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});