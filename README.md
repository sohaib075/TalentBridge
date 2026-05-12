# TalentBridge | Elite AI-Driven Applicant Tracking System (ATS)

![TalentBridge Banner](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2000)

TalentBridge is a high-fidelity, professional-grade Applicant Tracking System built with a modern stack. It features an elite Glassmorphic UI/UX, real-time application tracking, automated email notifications, and a seamless one-click application workflow.

## 🚀 Key Features

### 💎 Elite Experience
- **Glassmorphic Design System:** A stunning, translucent UI with vibrant gradients and smooth micro-animations.
- **Dynamic Portals:** Dedicated, high-performance dashboards for both Candidates and HR/Admins.
- **Responsive Layouts:** Perfectly optimized for mobile, tablet, and desktop viewing.

### 💼 Candidate Features
- **Smart Job Discovery:** Advanced search and filtering to find the perfect role.
- **Elite Application Workflow:** Custom modal-based applications with file persistence and validation.
- **Professional Dossier:** Centralized management for Resumes and Cover Letters with live preview links.
- **Application Tracking:** Real-time status updates from "Applied" to "Interviewing" or "Selected."

### 🛠️ HR & Admin Power
- **Talent Pipeline:** Visual management of applicants with review notes and status controls.
- **Automated Communication:** Integrated email service for shortlisting and interview scheduling.
- **Branch Management:** Distributed system architecture to manage multiple corporate locations.

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion |
| **Backend** | Node.js, Express, Multer (File Handling) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Storage** | Cloudinary (CDN for Resumes & Profiles) |
| **Auth** | JWT (JSON Web Tokens) with Secure Local Storage |

## ⚙️ Local Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Cloudinary Account

### 2. Backend Configuration
Navigate to the `backend` folder and create a `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 3. Frontend Configuration
Navigate to the `frontend` folder and create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Installation & Launch
```bash
# In the root directory
# Install Backend Dependencies
cd backend
npm install
npm run seed  # Seed the initial data
npm run dev

# In a new terminal
# Install Frontend Dependencies
cd frontend
npm install
npm run dev
```

---

Built with ❤️ for the Semester 8 Web Final Project.
