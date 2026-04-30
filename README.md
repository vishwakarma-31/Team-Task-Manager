# 🚀 Team Task Manager

![Project Overview](https://img.shields.io/badge/Status-Active-success) ![License](https://img.shields.io/badge/License-MIT-blue) ![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react) ![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb) ![Ant Design](https://img.shields.io/badge/UI-Ant%20Design-0170FE?logo=antdesign)

A comprehensive, full-stack team collaboration and task management platform. Team Task Manager is built to help organizations seamlessly organize projects, assign tasks, track progress, and manage granular user permissions without the clutter.

---

## ✨ Features

### 🛡️ Robust Role & Permission System
- **Global Roles**: `System Admin` and `Member`. System admins have elevated global privileges across the app and access to the Global Admin Panel.
- **Project-Level Roles**: `Project Owner`, `Project Admin`, and `Member`. 
  - Complete isolation of project authority from global authority. 
  - Project Owners and Project Admins can independently add/remove members and assign project admin rights securely.

### 📊 Comprehensive Dashboard Analytics
- Rich, interactive visualizations using **Recharts**.
- Live task metrics: Total, In Progress, Completed, and Overdue tasks.
- Pie charts and Bar charts displaying task distributions by status and project.

### 🗂️ Project & Task Management
- Create and organize unlimited projects.
- Assign tasks to team members with explicit due dates and priorities (High, Medium, Low).
- Advanced filtering and tracking: Filter tasks by project, assignee, status, or priority.

### 🎨 Premium UI/UX
- Built heavily on **Ant Design (antd)** for a sleek, enterprise-grade aesthetic.
- **Dynamic Skeleton Loading**: Layout-accurate skeleton loaders (wireframe transitions) implemented across every single page to ensure a seamless, non-jarring user experience while data fetches in the background.
- Intuitive navigation, interactive pop-ups, drop-downs, and color-coded status badges.

### 🔒 Security
- Secure JWT-based Authentication.
- Tokens are securely handled and stored in **HttpOnly cookies**, mitigating XSS vulnerabilities.
- Backend middleware explicitly checks roles and project-level authorization before mutating data.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **React.js**: Core UI library.
- **Ant Design (antd)**: For pre-built, robust UI components.
- **Recharts**: For dashboard data visualization.
- **React Router Dom**: For smooth SPA routing.
- **Vite**: Ultra-fast build tool and development server.

### Backend
- **Node.js & Express.js**: Fast, scalable API routing and logic.
- **MongoDB & Mongoose**: NoSQL Database for flexible, scalable schema architectures.
- **JSON Web Tokens (JWT)**: For robust session handling via cookies.
- **Bcrypt.js**: For secure password hashing.
- **Express-Validator**: For strict API payload validation.

---

## ⚙️ Local Development Setup

Follow these instructions to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Team-Task-Manager.git
cd Team-Task-Manager
```

### 2. Setup the Backend
Open a terminal and navigate to the backend folder:
```bash
cd backend

# Install dependencies
npm install

# Create environment variables
cp .env.example .env
```
Ensure your `.env` file looks like this:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

Start the backend development server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend

# Install dependencies
npm install

# Create environment variables
cp .env.example .env
```
Ensure your frontend `.env` points to your local backend API:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

The application will now be running at `http://localhost:5173`.

---

## 👥 Usage Guide

1. **Register/Login**: Start by registering an account. By default, newly registered users are given standard `member` roles for security purposes.
2. **First Project**: Navigate to the Projects tab and click "Create Project". You will automatically become the `Project Owner`.
3. **Invite Members**: Inside the project details page, invite registered users to your project.
4. **Delegate Authority**: Use the dropdown next to a member's name to upgrade them to a `Project Admin`.
5. **Manage Tasks**: Start creating tasks, assigning them to your team, and setting due dates!

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/your-username/Team-Task-Manager/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).