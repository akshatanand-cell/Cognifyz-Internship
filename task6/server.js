require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// ===== CONNECT TO MONGODB =====
mongoose.connect('mongodb://akshat:akshat123@ac-eean6lc-shard-00-00.ukklceh.mongodb.net:27017,ac-eean6lc-shard-00-01.ukklceh.mongodb.net:27017,ac-eean6lc-shard-00-02.ukklceh.mongodb.net:27017/cognifyz?ssl=true&replicaSet=atlas-dotaic-shard-0&authSource=admin&appName=Cluster0')
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.log('❌ MongoDB Error:', err));

// ===== USER MODEL =====
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ===== NOTE MODEL =====
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

// ===== AUTH MIDDLEWARE =====
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    try {
        const decoded = jwt.verify(token, 'cognifyz_secret_key_2026');
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/login');
    }
};

// ===== ROUTES =====

// Home
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Register page
app.get('/register', (req, res) => {
    res.render('register', { error: null, success: null });
});

// Register handler
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.render('register', { 
                error: 'Email already registered!', 
                success: null 
            });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Create user
        await User.create({ name, email, password: hashed });

        res.render('register', { 
            error: null, 
            success: 'Account created! Please login.' 
        });
    } catch (err) {
        res.render('register', { 
            error: 'Something went wrong!', 
            success: null 
        });
    }
});

// Login page
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login handler
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'Email not found!' });
        }

        // Check password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.render('login', { error: 'Wrong password!' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            'cognifyz_secret_key_2026',
            { expiresIn: '24h' }
        );

        // Set cookie
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');

    } catch (err) {
        res.render('login', { error: 'Something went wrong!' });
    }
});

// Dashboard - PROTECTED
app.get('/dashboard', authMiddleware, async (req, res) => {
    const notes = await Note.find({ userId: req.user.id })
        .sort({ createdAt: -1 });
    res.render('dashboard', { user: req.user, notes });
});

// ===== NOTES API =====

// Add note
app.post('/notes', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    await Note.create({ 
        title, content, 
        userId: req.user.id 
    });
    res.redirect('/dashboard');
});

// Delete note
app.post('/notes/delete/:id', authMiddleware, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});