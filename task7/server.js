require('dotenv').config();
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const API_KEY = process.env.WEATHER_API_KEY;

// ===== RATE LIMITING =====
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // max 10 requests per minute
    message: { error: 'Too many requests! Please wait a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// ===== ROUTES =====

// Home
app.get('/', (req, res) => {
    res.render('index', { weather: null, error: null, city: null });
});

// Search weather
app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.render('index', { 
            weather: null, 
            error: 'Please enter a city name!', 
            city: null 
        });
    }

    try {
        // Current weather
        const weatherRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        // 5 day forecast
        const forecastRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        const weather = weatherRes.data;
        const forecast = forecastRes.data;

        // Get one forecast per day
        const dailyForecast = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);

        res.render('index', { 
            weather, 
            forecast: dailyForecast,
            error: null, 
            city 
        });

    } catch (err) {
        let errorMsg = 'City not found! Please try again.';
        if (err.response && err.response.status === 429) {
            errorMsg = 'API limit reached! Please try again later.';
        }
        res.render('index', { 
            weather: null, 
            forecast: null,
            error: errorMsg, 
            city 
        });
    }
});

// ===== REST API ENDPOINTS =====

// GET weather API
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ 
            success: false, 
            error: 'City parameter required' 
        });
    }
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        res.json({ success: true, data: response.data });
    } catch (err) {
        res.status(404).json({ 
            success: false, 
            error: 'City not found' 
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running at http://localhost:3000');
});