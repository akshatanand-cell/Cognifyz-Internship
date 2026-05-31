const express = require('express');
const app = express();

// Set EJS as template engine
app.set('view engine', 'ejs');

// Allow reading form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Temporary storage
let users = [];

// HOME ROUTE
app.get('/', (req, res) => {
    res.render('index');
});

// REGISTER ROUTE
app.post('/register', (req, res) => {
    const { name, email, password, phone, gender, interests } = req.body;
    let errors = [];

    // Server side validation
    if (!name || name.length < 3) {
        errors.push('Name must be at least 3 characters');
    }
    if (!email || !email.includes('@')) {
        errors.push('Invalid email address');
    }
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!phone || phone.length !== 10) {
        errors.push('Phone must be 10 digits');
    }
    if (!gender) {
        errors.push('Please select a gender');
    }

    if (errors.length > 0) {
        return res.json({ success: false, errors });
    }

    // Store user
    const user = { 
        id: users.length + 1,
        name, email, phone, gender,
        interests: interests || [],
        joinedAt: new Date().toLocaleString()
    };
    users.push(user);

    res.json({ success: true, user });
});

// GET ALL USERS
app.get('/users', (req, res) => {
    res.json({ users });
});

// DELETE USER
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    res.json({ success: true });
});

// Start server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});