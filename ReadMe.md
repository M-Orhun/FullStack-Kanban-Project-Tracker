# 🚀 Full-Stack Kanban Project Tracker: [Proje Adı Ekle]

## Project Overview

This application is a feature-rich, internationalized Kanban board demonstrating a full-stack approach to task management. It utilizes modern technologies to provide an intuitive and responsive user experience for tracking task progress and managing deadlines.

---

## ✨ Key Features & UX Highlights

| Feature | Technical Implementation | Value Proposition |
| :--- | :--- | :--- |
| **Dynamic Urgency UI** | Custom **HSL color calculation** in React based on `Due Date` proximity. | Tasks visually shift from **Neutral** to **Critical Red** as the deadline approaches (10-day window). Completed tasks are Green. |
| **Smooth Drag & Drop (D&D)** | Implemented using the `@hello-pangea/dnd` library, isolated to the task title handle to prevent `onClick` conflicts. | Ensures seamless, non-blocking task movement between columns, even on mobile devices. |
| **Comprehensive Task Editor** | Modal interface for viewing and editing `Title`, `Description`, and `Due Date` with persistence to the database. | Provides a focused, single source of truth for task details. |
| **Data Validation** | Frontend **JavaScript checks** (in `TaskDetailModal.tsx`) prevent users from setting deadlines in the past. | Improves data integrity and user adherence to process rules. |
| **Full CRUD** | Complete Create, Read, Update (D&D and Modal Edit), and Delete functionality via REST API endpoints. | Demonstrates end-to-end full-stack development capability. |

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | **React.js, TypeScript** |
| **State Management** | **React Hooks (useState, useEffect)** |
| **Styling** | **CSS3 / CSS Variables** |
| **API Client** | **Axios** |
| **Backend** | **Node.js, Express** |
| **Database** | **MongoDB Atlas / Mongoose** |
| **Tools** | **Git, GitHub, VS Code** |

## ⚙️ Installation & Local Setup

To run this application, ensure you have **Node.js (v18+)** and **npm** installed.

### 1. Backend Setup (API)

```bash
# Terminal 1: Initialize the backend server
cd backend
npm install
npm start
# Server runs on http://localhost:5000. Check console for MongoDB connection success.

# Terminal 2: Initialize the frontend application
cd frontend
npm install
npm start
# Application runs on http://localhost:3000.

Role	Details
Developer	Muhammed ORHUN
University	Uskudar University
Contact	muhammed.orhunn@gmail.com