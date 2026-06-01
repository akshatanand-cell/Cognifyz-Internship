# ⚙️ Task 8 – Advanced Server‑Side Functionality

> **Cognifyz Technologies Internship** – Full Stack Development  
> **Focus:** Middleware, request logging, advanced routing, error handling

---

## 🎯 Objective

Production‑ready enhancements: log all requests to a file, create modular route handlers, implement global error handling middleware, and add a health check endpoint.

---

## 🚀 Features

- Custom logging middleware writing to `requests.log` (date, method, URL, response time)
- Modular routing using `express.Router()`
- Global error‑handling middleware (catches all `next(err)`)
- Environment‑based configuration (dev/prod)
- Health check endpoint `GET /health` for monitoring
- 404 handler for unmatched routes

---

## 🖥️ How to Run


cd task8
npm install
node server.js   # or npm run dev
Check requests.log after making a few requests.

📸 Screenshots
Console Logging	requests.log file
https://console_log.png	https://logfile.png
💡 What I Learned
How middleware functions work (order matters)

Creating reusable route modules

Structured logging for debugging and auditing

Professional error propagation with custom error classes

🏁 Internship Conclusion
This task wraps up the Cognifyz internship. The full stack is now robust:
✅ Frontend with validation & API integration
✅ Backend with authentication & database
✅ Production features (logging, error handling, environment config)
