# Setup & Installation Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account
- Cloudinary account  
- Gmail account

### Step 1: Clone & Install Dependencies

```bash
cd "d:\uni data\semester 8\web\WEB FINAL PROJECT"
npm install

cd backend
npm install
cd ..
```

### Step 2: Configure Backend Environment

Create `backend/.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ats_db

# Server
PORT=5000
NODE_ENV=development

# JWT Secret (change in production!)
JWT_SECRET=your_super_secret_jwt_key_here_change_me_in_production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail SMTP
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your_app_password_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Admin Email
ADMIN_EMAIL=admin@company.com
```

### Step 3: Configure Frontend Environment

Create `.env` in project root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Step 4: Seed Database (Optional)

```bash
cd backend
npm run seed
cd ..
```

### Step 5: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

## 📋 Detailed Configuration

### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user (save username/password)
4. Get connection string from "Connect"
5. Replace `<password>` and `<username>` in the connection string
6. Add `/ats_db` at the end for database name
7. Paste into `backend/.env` as `MONGODB_URI`

Example URI:
```
mongodb+srv://atsuser:mypassword123@cluster0.mongodb.net/ats_db?retryWrites=true&w=majority
```

### Cloudinary Setup

1. Go to https://cloudinary.com/
2. Sign up (free account)
3. Go to Dashboard
4. Copy these 3 values:
   - **Cloud Name**: Under "API Environment variable"
   - **API Key**: Shown on dashboard
   - **API Secret**: Click "Generate new" to get one
5. Paste all 3 into `backend/.env`

### Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App passwords**
4. Select:
   - App: **Mail**
   - Device: **Windows Computer** (or your OS)
5. Click **Generate**
6. Copy the 16-character password
7. Paste into `backend/.env` as `GMAIL_PASSWORD`

Note: For Gmail username in `.env`, use your full email address (e.g., `your-email@gmail.com`)

## 🗄️ Database Seeding

The seed script creates sample data for testing:

**Branches:** Islamabad, Lahore, Karachi, Remote
**Users:**
- Admin: admin@company.com / admin123
- HR: hr@company.com / hr123
- Candidate 1: ahmed@example.com / candidate123
- Candidate 2: fatima@example.com / candidate123

**Jobs:** 3 sample job postings

To run:
```bash
cd backend
npm run seed
```

## 🎯 Testing the System

### Test Flow 1: Candidate

1. Go to http://localhost:5173
2. Click "Register"
3. Register as Candidate
4. Go to "Browse Jobs"
5. Apply for a job
6. Go to "My Applications" dashboard

### Test Flow 2: HR

1. Register as HR
2. Click "HR Dashboard"
3. Click "Post New Job"
4. Fill job form and post
5. Go to "Manage Applications"
6. Shortlist/reject applications

### Test Flow 3: Use Demo Credentials

Instead of registering:
1. Go to /login
2. Use: `hr@company.com` / `hr123`
3. All demo data already in database

## ⚠️ Common Issues & Solutions

### MongoDB Connection Error

**Error:** `Cannot connect to MongoDB`

**Solution:**
1. Check connection string is correct
2. Add your IP to MongoDB Atlas whitelist:
   - Go to Security → Network Access
   - Click "Add IP Address"
   - Add your current IP or 0.0.0.0/0 (less secure)

### Cloudinary Upload Failed

**Error:** `Failed to upload to Cloudinary`

**Solution:**
1. Verify credentials in `backend/.env`
2. Check file size (max: 5MB for files)
3. Ensure file type is allowed (PDF, DOCX, JPG, PNG)

### Email Not Sending

**Error:** `Email service error` or `SMTP authentication failed`

**Solution:**
1. Verify Gmail 2-Step Verification is enabled
2. Use App Password (not your regular Gmail password)
3. Check Gmail address matches `GMAIL_USER` in `.env`
4. Wait 5 minutes after generating app password before using

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use different port in backend/.env
PORT=5001
```

### CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Verify `FRONTEND_URL` matches your frontend URL in `backend/.env`
2. Check backend is running
3. Clear browser cache (Ctrl+Shift+Delete)

## 📁 Project Structure

```
WEB FINAL PROJECT/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── utils/
│   │   └── seeds/
│   ├── package.json
│   ├── .env
│   └── .gitignore
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   ├── candidate/
│   │   ├── hr/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── README.md
└── SETUP.md
```

## 🔄 Development Workflow

### Backend Development
```bash
cd backend
npm run dev
# Server auto-restarts on file changes (via nodemon)
```

### Frontend Development
```bash
npm run dev
# Frontend auto-reloads on file changes
```

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
npm run build
# Creates dist/ folder for deployment
```

## 🔒 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Never commit `.env` files to git
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Use strong passwords for MongoDB
- [ ] Restrict MongoDB IP whitelist in production
- [ ] Use environment-specific configurations
- [ ] Rotate Cloudinary API keys regularly
- [ ] Monitor email quota for Gmail

## 📚 Useful Commands

```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev

# Start backend dev server
cd backend && npm run dev

# Seed database
cd backend && npm run seed

# Build frontend for production
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

## 🆘 Need Help?

1. Check MongoDB connection
2. Verify all `.env` variables are set
3. Check console logs for error messages
4. Ensure backend is running before starting frontend
5. Clear browser cache if issues persist

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] MongoDB connection successful (check console)
- [ ] Can login with demo credentials
- [ ] Can upload files (resume, cover letter)
- [ ] Emails sending successfully (check Gmail)
- [ ] All pages loading without errors

---

**Setup complete! You're ready to develop. 🎉**
