# AI Adaptive Certification Assessment Platform

An AI-powered adaptive certification assessment system built using the MERN stack.

## Folder Structure

```
AI-Certification-Platform/
├── backend/            # Express REST API, Mongoose Models, AI Services, PDF generator
├── frontend/           # React SPA (Vite, Tailwind, Recharts)
├── .env                # Global configuration
├── package.json        # Main project control
└── README.md           # This file
```

## Setup Instructions

1. **Prerequisites**: Ensure you have Node.js (v18+) and MongoDB installed and running.
2. **Environment Variables**: Open `.env` in the root folder and add your `GROQ_API_KEY`.
3. **Install Dependencies**:
   ```bash
   npm run install-all
   ```
4. **Run Application (Development)**:
   ```bash
   npm run dev
   ```
   - Frontend starts on `http://localhost:5173`
   - Backend starts on `http://localhost:5000`
