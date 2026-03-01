# Daily Status App 🗓️

## 📁 Folder Structure (IMPORTANT — keep this exact layout)
```
daily-status/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Log.js
│   │   ├── routes/
│   │   │   └── logs.js
│   │   └── server.js
│   ├── .env
│   └── package.json        ← run npm install here
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── api.js
    │   └── index.js
    ├── .env
    └── package.json        ← run npm install here
```

---

## ✅ Step-by-step Setup

### Step 1 — Start MongoDB
Make sure MongoDB is running on your machine.
- Windows: Run `mongod` in a terminal, or start it from MongoDB Compass
- Or use MongoDB Atlas (free cloud) — update MONGODB_URI in backend/.env

### Step 2 — Backend
Open a terminal in the `backend/` folder:
```bash
npm install
npm run dev
```
You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

### Step 3 — Frontend
Open a NEW terminal in the `frontend/` folder:
```bash
npm install
npm start
```
Browser opens at http://localhost:3000 ✓

---

## 🔌 API Endpoints (backend on port 5000)
| Method | URL              | What it does     |
|--------|-----------------|------------------|
| GET    | /api/logs        | Get all logs     |
| POST   | /api/logs        | Save a new log   |
| PUT    | /api/logs/:id    | Update a log     |
| DELETE | /api/logs/:id    | Delete a log     |
| GET    | /api/health      | Check DB status  |

---

## ☁️ Using MongoDB Atlas (free cloud DB)
1. Go to https://cloud.mongodb.com — create a free account + cluster
2. Click "Connect" → get your connection string
3. Open `backend/.env` and replace:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/daily-status
   ```
