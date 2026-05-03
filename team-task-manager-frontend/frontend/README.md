# 🚀 Team Task Manager (Full Stack)

A full-stack web application where teams can manage projects, assign tasks, and track progress with role-based access control.

---

## 🔗 Live Demo

- 🌐 Frontend: https://your-frontend-url.up.railway.app
- ⚙️ Backend API: https://your-backend-url.up.railway.app

---

## 🎯 Features

### 🔐 Authentication

- User Signup & Login
- JWT-based authentication
- Role-based access (Admin / Member)

---

### 📁 Project Management

- Admin can create projects
- Projects contain multiple tasks
- Users can view assigned projects

---

### ✅ Task Management

- Create tasks within projects
- Assign tasks to users
- Track task status:
  - `Todo`
  - `In Progress`
  - `Done`

---

### 👤 User Functionality

- View assigned projects
- View only their tasks
- Mark tasks as **Done**

---

### 📊 Dashboard

- View tasks by:
  - Todo
  - Completed
  - Overdue

---

## 🛠 Tech Stack

### Frontend

- React (Vite)
- Axios
- CSS (basic styling)

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)

### Deployment

- Railway (Backend + Frontend)

---

## 📂 Project Structure

```bash
team-task-manager/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── App.jsx
│   ├── package.json
│   └── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/team-task-manager.git
cd team-task-manager
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
node server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 API Endpoints

### Auth

- `POST /signup`
- `POST /login`

### Projects

- `POST /project`
- `GET /projects`

### Tasks

- `POST /task`
- `GET /tasks`
- `PUT /task/:id`

---

## 🔐 Roles

| Role   | Permissions                   |
| ------ | ----------------------------- |
| Admin  | Create projects, assign tasks |
| Member | View tasks, mark as done      |

---

## 🎥 Demo Video

👉 (Add your 2–5 min demo video link here)

---

## 🧠 Key Learnings

- Implemented full-stack architecture
- Handled JWT authentication
- Designed role-based access control (RBAC)
- Managed MongoDB relationships
- Deployed full-stack app on Railway

---

## 📌 Future Improvements

- Better UI/UX design
- Notifications for task updates
- File attachments for tasks
- Real-time updates (WebSockets)

---

## 👤 Author

Kashyap Kompella
GitHub: https://github.com/KashyapKompella31264

---

## ⭐ Acknowledgement

This project was built as part of a full-stack assignment to demonstrate practical skills in modern web development.

---
