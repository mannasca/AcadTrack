📘 AcadTrack – Academic Activity Tracker

AcadTrack is a simple full-stack web app that helps students manage and track their academic tasks like assignments, labs, quizzes, and projects.
Built using React (frontend) and Node.js + Express + MongoDB (backend).

🚀 Features

User registration & login (JWT-based)

Add academic activities

View all activities in a dashboard

Track course, date, description, and status

Clean and easy-to-use UI

🛠 Tech Stack

Frontend: React, React Router, CSS

Backend: Node.js, Express, MongoDB, JWT

Database: MongoDB Atlas or Local MongoDB

📁 Project Structure
backend/   → Express API
frontend/  → React app (UI)

⚙️ Setup Instructions
Backend
cd backend
npm install
npm start


Create .env:

MONGO_URI=your_connection_string
JWT_SECRET=your_secret
PORT=5000

Frontend
cd frontend
npm install
npm run dev


Create .env:

VITE_API_URL=http://localhost:5000

📡 API Endpoints

POST /api/auth/register – Register user

POST /api/auth/login – Login

GET /api/activities – Get activities

POST /api/activities/create – Add activity

✔️ Future Enhancements

Edit/delete activity

Calendar view

Dashboard analytics

Dark mode
