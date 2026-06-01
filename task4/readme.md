# ⚡ Task 4 – Complex Form Validation & Dynamic DOM Manipulation

> **Cognifyz Technologies Internship** – Full Stack Development  
> **Focus:** Real‑time client‑side validation, dynamic error messages

---

## 🎯 Objective

Implement real‑time JavaScript validation on the frontend (without page reload) while keeping server‑side validation as a fallback. Dynamically show/hide error messages and disable submit button until form is valid.

---

## 🚀 Features

- Client‑side validation using `input` and `blur` events
- Real‑time feedback: green border on valid, red border on invalid
- Custom error messages injected into DOM
- Submit button enabled only when all fields are valid
- Server‑side validation remains as security backup

---

## 🖥️ How to Run


cd task4
npm install
node server.js
Try typing invalid data – see instant feedback.

📸 Screenshots
Before Typing	After Valid Input	Error State
https://initial.png	https://valid.png	https://error.png
💡 What I Learned
DOM manipulation with querySelector, classList, createElement

Event delegation and debouncing for performance

Double‑layer validation (frontend for UX, backend for security)

