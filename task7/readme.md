# 🔑 Task 7 – Advanced API Usage & External API Integration

> **Cognifyz Technologies Internship** – Full Stack Development  
> **Focus:** Environment variables, third‑party APIs (with API keys), data caching

---

## 🎯 Objective

Integrate a **real external API that requires an API key** (e.g., OpenWeatherMap, News API, or GitHub API). Secure the key using `.env`, implement request throttling or caching to avoid rate limits, and display enriched data on the frontend.

---

## 🚀 Features

- `.env` file for API keys (excluded from git via `.gitignore`)
- Server‑side API call (to protect the key)
- Display weather/news/stock data based on user input (e.g., city name)
- Simple in‑memory caching to reduce duplicate API calls
- Loading and error states on frontend

---

## 🖥️ How to Run

cd task7
npm install
cp .env.example .env   # add your API key
node server.js
📸 Screenshots
Weather Form	Result with Data
https://weather_form.png	https://weather_result.png
💡 What I Learned
Protecting secrets with dotenv and .gitignore

Making server‑side API calls with axios or node-fetch

Caching strategies (time‑based expiration) to respect API limits

