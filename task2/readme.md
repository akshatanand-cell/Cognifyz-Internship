# 🎨 Task 2 – Inline Styles & Server‑Side Validation

> **Cognifyz Technologies Internship** – Full Stack Development  
> **Focus:** CSS styling + backend validation

---

## 🎯 Objective

Enhance Task 1 with inline CSS for a better UI, and implement server‑side validation for required fields (name, email, message). Display error messages if validation fails.

---

## 🚀 Features

- Inline CSS for form styling (background, padding, border radius)
- Server‑side validation:
  - Name: not empty
  - Email: valid email format (regex)
  - Message: at least 10 characters
- Error messages displayed above the form
- Preserves user input after validation failure

---

## 🖥️ How to Run

cd task2
npm install
node server.js
Visit http://localhost:3000

📸 Screenshots
Valid Form	Validation Error
https://valid.png	https://error.png
💡 What I Learned
Combining frontend aesthetics with backend logic

Using regex for email validation

Passing error objects to EJS templates

