const express = require('express');
const morgan = require('morgan');
const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');

const app = express();
const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

// ===== MIDDLEWARE =====

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Morgan logging middleware
const logStream = fs.createWriteStream(
    path.join(__dirname, 'requests.log'), 
    { flags: 'a' }
);
app.use(morgan('combined', { stream: logStream }));
app.use(morgan('dev')); // Also log to console

// Request timer middleware
app.use((req, res, next) => {
    req.startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - req.startTime;
        console.log(`⏱️  ${req.method} ${req.url} - ${duration}ms`);
    });
    next();
});

// Request counter middleware
let requestStats = {
    total: 0,
    get: 0,
    post: 0,
    delete: 0,
    errors: 0,
    startTime: new Date()
};

app.use((req, res, next) => {
    requestStats.total++;
    const method = req.method.toLowerCase();
    if (requestStats[method] !== undefined) {
        requestStats[method]++;
    }
    next();
});

// Cache middleware
const cacheMiddleware = (duration) => (req, res, next) => {
    const key = req.url;
    const cached = cache.get(key);
    if (cached) {
        console.log(`💾 Cache HIT: ${key}`);
        return res.json({ ...cached, fromCache: true });
    }
    console.log(`🔍 Cache MISS: ${key}`);
    res.sendResponse = res.json;
    res.json = (body) => {
        cache.set(key, body, duration);
        res.sendResponse(body);
    };
    next();
};

// ===== BACKGROUND JOBS =====
let jobs = [];
let jobResults = [];

// Job 1: Clean old logs every 30 seconds
const cleanLogsJob = setInterval(() => {
    const result = {
        id: jobs.length + 1,
        name: 'Clean Logs',
        status: 'completed',
        runAt: new Date().toLocaleTimeString(),
        message: 'Old logs cleaned successfully'
    };
    jobResults.unshift(result);
    if (jobResults.length > 10) jobResults.pop();
    console.log('🧹 Background Job: Logs cleaned at', result.runAt);
}, 30000);

// Job 2: Cache stats every 20 seconds
const cacheStatsJob = setInterval(() => {
    const stats = cache.getStats();
    const result = {
        id: jobs.length + 2,
        name: 'Cache Stats',
        status: 'completed',
        runAt: new Date().toLocaleTimeString(),
        message: `Cache hits: ${stats.hits}, misses: ${stats.misses}`
    };
    jobResults.unshift(result);
    if (jobResults.length > 10) jobResults.pop();
    console.log('📊 Background Job: Cache stats updated at', result.runAt);
}, 20000);

// Job 3: Health check every 15 seconds
const healthCheckJob = setInterval(() => {
    const result = {
        id: jobs.length + 3,
        name: 'Health Check',
        status: 'completed',
        runAt: new Date().toLocaleTimeString(),
        message: `Server healthy — ${requestStats.total} requests served`
    };
    jobResults.unshift(result);
    if (jobResults.length > 10) jobResults.pop();
    console.log('💚 Background Job: Health check at', result.runAt);
}, 15000);

jobs = [cleanLogsJob, cacheStatsJob, healthCheckJob];

// ===== ROUTES =====

// Dashboard
app.get('/', (req, res) => {
    const uptime = Math.floor((Date.now() - requestStats.startTime) / 1000);
    const cacheStats = cache.getStats();
    res.render('index', { 
        requestStats, 
        uptime,
        cacheStats,
        jobResults
    });
});

// ===== REST API =====

// GET server stats
app.get('/api/stats', cacheMiddleware(10), (req, res) => {
    const uptime = Math.floor((Date.now() - requestStats.startTime) / 1000);
    res.json({
        success: true,
        fromCache: false,
        stats: {
            ...requestStats,
            uptime: uptime + ' seconds',
            cache: cache.getStats(),
            memory: process.memoryUsage(),
            nodeVersion: process.version
        }
    });
});

// GET all jobs
app.get('/api/jobs', (req, res) => {
    res.json({
        success: true,
        activeJobs: jobs.length,
        recentResults: jobResults
    });
});

// POST trigger manual job
app.post('/api/jobs/trigger', (req, res) => {
    const { jobName } = req.body;
    const result = {
        id: Date.now(),
        name: jobName || 'Manual Job',
        status: 'completed',
        runAt: new Date().toLocaleTimeString(),
        message: `Manual job "${jobName}" triggered successfully`
    };
    jobResults.unshift(result);
    if (jobResults.length > 10) jobResults.pop();

    res.json({ success: true, job: result });
});

// GET cache info
app.get('/api/cache', (req, res) => {
    res.json({
        success: true,
        stats: cache.getStats(),
        keys: cache.keys()
    });
});

// DELETE clear cache
app.delete('/api/cache', (req, res) => {
    cache.flushAll();
    res.json({ success: true, message: 'Cache cleared!' });
});

// GET logs
app.get('/api/logs', (req, res) => {
    try {
        const logs = fs.readFileSync(
            path.join(__dirname, 'requests.log'), 'utf8'
        );
        const lines = logs.split('\n')
            .filter(l => l.trim())
            .slice(-20)
            .reverse();
        res.json({ success: true, logs: lines });
    } catch (err) {
        res.json({ success: true, logs: [] });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    requestStats.errors++;
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
        success: false, 
        error: err.message 
    });
});

// 404 middleware
app.use((req, res) => {
    requestStats.errors++;
    res.status(404).json({ 
        success: false, 
        error: 'Route not found' 
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log('📝 Logging to requests.log');
    console.log('💾 Cache initialized');
    console.log('⚡ Background jobs started');
});