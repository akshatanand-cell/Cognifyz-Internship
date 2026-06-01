# 🌐 Task 5 – API Integration & Front‑End Interaction

> **Cognifyz Technologies Internship** – Full Stack Development  
> **Focus:** Fetch API, displaying external data, async/await

---

## 🎯 Objective

Integrate a public REST API (e.g., JSONPlaceholder or a weather API) into the existing form page. Display data (e.g., posts, users, or weather) dynamically without refreshing.

---

## 🚀 Features

- Fetch data from a public API using `fetch()` and async/await
- Display list of items (e.g., user comments or posts) on the same page
- Loading spinner while fetching
- Error handling for failed requests
- Optional: Refresh button to reload data

---

## 🖥️ How to Run


cd task5
npm install
node server.js
The form is still present; API data appears below it.

📸 Screenshots
Loading State	Data Displayed
https://loading.png	https://data.png
💡 What I Learned
Making asynchronous HTTP requests from the browser

Handling promises and updating the DOM with dynamic data

Graceful error handling for network issues
