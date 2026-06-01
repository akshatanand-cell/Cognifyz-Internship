# 🔐 Task 6 – Database Integration & User Authentication

> **Cognifyz Technologies Internship** – Full Stack Development  
> **Focus:** SQLite/PostgreSQL, signup/login, session management

---

## 🎯 Objective

Add a user authentication system: registration, login, and protected routes. Store user credentials securely in a database with hashed passwords.

---

## 🚀 Features

- SQLite database (or PostgreSQL) with a `users` table
- Password hashing using `bcrypt`
- Session management with `express-session`
- Registration: check for existing email, hash password, store user
- Login: verify credentials, start session
- Protected route: `/dashboard` only accessible when logged in
- Logout endpoint

---

## 🖥️ How to Run

cd task6
npm install
node server.js
Register a new account, then log in.

📸 Screenshots
Registration Page	Dashboard (protected)
https://register.png	https://dashboard.png
💡 What I Learned
Never store plaintext passwords – always hash with bcrypt

Session‑based authentication vs JWT (pros/cons)

SQL injection prevention using parameterized queries

