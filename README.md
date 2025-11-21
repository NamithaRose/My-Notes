# My Notes – Full Stack Task Manager Application

This is a full-stack Notes / Task Manager application built using Next.js for the frontend and Node.js, Express, and MongoDB for the backend.
The application includes user authentication, protected routes, and complete CRUD functionality for tasks, with a consistent and modern UI.

---------------------------------------------------------
FEATURES
---------------------------------------------------------

Authentication
- User Signup
- User Login
- Password hashing
- JWT-based authentication
- Protected API routes
- Auto-redirect if user is not logged in

Task Management
- Add tasks (title and description)
- Edit tasks
- Delete tasks with confirmation dialog
- Search tasks
- Sort tasks (Latest / Oldest)
- Fully responsive design

UI / UX
- Modern dark theme across all pages
- Large readable UI components
- Smooth animations
- Visually consistent forms, buttons, and cards
- Clean layout with no header bar

Backend
- Node.js + Express REST API
- MongoDB (Mongoose)
- User and Notes models
- Authentication middleware
- CRUD routes for Notes

---------------------------------------------------------
PROJECT STRUCTURE
---------------------------------------------------------

primetrade/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
└── notes-frontend/
    ├── app/
    │   ├── login/
    │   ├── signup/
    │   ├── dashboard/
    │   └── globals.css
    ├── public/
    └── package.json

---------------------------------------------------------
INSTALLATION AND RUNNING
---------------------------------------------------------

1. Clone the repository

git clone (https://github.com/NamithaRose/My-Notes.git)
cd primetrade

---------------------------------------------------------
BACKEND SETUP
---------------------------------------------------------

cd backend
npm install

Create a file named .env and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Start backend:

npx nodemon server.js

Backend URL:
http://localhost:5000

---------------------------------------------------------
FRONTEND SETUP
---------------------------------------------------------

cd notes-frontend
npm install

Start frontend:

npm run dev

Frontend URL:
http://localhost:3000/login

---------------------------------------------------------
API ROUTES
---------------------------------------------------------

Auth:
POST /api/auth/signup
POST /api/auth/login

Notes (Protected):
GET /api/notes
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id

---------------------------------------------------------
TECH STACK
---------------------------------------------------------

Frontend:
- Next.js (App Router)
- React
- Axios
- Custom CSS (Premium UI)

Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
---------------------------------------------------------
SCREENSHOTS
---------------------------------------------------------
<img width="1001" height="553" alt="image" src="https://github.com/user-attachments/assets/5d003186-e2c1-4744-a9f0-5065350db965" />
<img width="1021" height="628" alt="image" src="https://github.com/user-attachments/assets/cb9e4140-6d14-4e9d-8f39-8854327bf416" />
<img width="1018" height="817" alt="image" src="https://github.com/user-attachments/assets/f68b4508-6a27-419d-ad7e-92d214071b4d" />


---------------------------------------------------------
FUTURE IMPROVEMENTS
---------------------------------------------------------

- Task categories
- File attachments
- User profile page
- Theme switch (Dark/Light)
- Drag-and-drop task ordering

---------------------------------------------------------
LICENSE
---------------------------------------------------------

This project is open source and free to use.
