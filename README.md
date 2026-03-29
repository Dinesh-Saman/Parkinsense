# 🧠 ParkinSense

> AI-powered Parkinson's Disease early detection system for Sri Lanka.  
> Combines voice biomarker analysis and spiral drawing assessment to help identify early-stage PD.

---

## 📁 Project Structure

```
ParkinSense/
├── Frontend/       # React + Vite web application     → http://localhost:5173
├── Backend/        # Node.js + Express REST API        → http://localhost:5002
└── ML-Server/      # Python Flask AI inference server  → http://localhost:5005
```

---

## ⚙️ Prerequisites

Make sure the following are installed before proceeding:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| Python | 3.10–3.12 | https://python.org |
| MongoDB | Atlas (cloud) or local | https://mongodb.com |
| Git | any | https://git-scm.com |

---

## 🚀 Quick Start (Run All Three Servers)

Open **three separate terminal windows** and run each service independently.

---

## 1️⃣ ML Server (Flask — Python)

The AI inference server handles voice biomarker analysis and spiral drawing classification.

### Setup

```bash
cd ML-Server

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### Run

```bash
python app.py
```

✅ Server starts at: `http://localhost:5005`

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Spiral drawing Parkinson's prediction |
| `POST` | `/predict_voice` | Voice biomarker Parkinson's prediction |

### (Optional) Train the Voice Model

Only needed if `ML-Server/voice/model/` is missing:

```bash
cd ML-Server/voice
python train_voice_dataset.py
```

---

## 2️⃣ Backend (Node.js + Express)

The REST API server handles authentication, assessments, and data persistence with MongoDB.

### Environment Variables

Create a `.env` file inside `Backend/` with the following:

```env
PORT=5002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Email (for forgot password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

### Setup

```bash
cd Backend
npm install
```

### Run

```bash
node server.js
```

✅ Server starts at: `http://localhost:5002`

### API Routes

| Route | Description |
|-------|-------------|
| `/api/auth` | Register, login, forgot/reset password |
| `/api/assessments` | Save and fetch assessment history |
| `/api/recommendations` | AI-generated health recommendations |
| `/api/spiral` | Spiral drawing test results |
| `/api/voice` | Voice analysis results |

---

## 3️⃣ Frontend (React + Vite)

The web application built with React 19, Tailwind CSS, and Framer Motion.

### Environment Variables

Create a `.env` file inside `Frontend/` with the following:

```env
VITE_API_URL=http://localhost:5002/api

# EmailJS (contact form)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Cloudinary (image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Setup

```bash
cd Frontend
npm install
```

### Run

```bash
npm run dev
```

✅ App opens at: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 🌐 Service Port Summary

| Service | Technology | Port | Start Command |
|---------|-----------|------|---------------|
| Frontend | React + Vite | `5173` | `npm run dev` |
| Backend | Node.js + Express | `5002` | `node server.js` |
| ML Server | Python + Flask | `5005` | `python app.py` |

---

## 🤖 AI Features

### 🎙️ Voice Analysis
- Extracts **22 UCI biomedical voice features** (jitter, shimmer, HNR, RPDE, DFA, etc.)
- Trained on the [UCI Parkinson's Dataset](https://archive.ics.uci.edu/ml/datasets/parkinsons)
- Model: **Random Forest** with 10-fold cross-validation (~98% accuracy)
- Classification threshold: `0.60` (optimized to minimize false positives)

### ✏️ Spiral Drawing Test
- Uploads a photo of a hand-drawn spiral
- Model: **ResNet-18** CNN fine-tuned on HandPD dataset
- Binary classification: `Parkinson` vs `Healthy`

---

## 🗂️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express 5, MongoDB, Mongoose, JWT |
| ML Server | Python, Flask, scikit-learn, librosa, Praat (parselmouth), PyTorch |
| Database | MongoDB Atlas |
| Auth | JWT + Google OAuth |

---

## 🐛 Common Issues

### `float32 is not JSON serializable` (ML Server)
Ensure you have the latest `voice_predict.py` — the fix casts numpy `float32` to native Python `float` before returning the response.

### `MongoDB connection error` (Backend)
Verify your `MONGODB_URI` in `Backend/.env` is correct and that your IP is whitelisted in MongoDB Atlas.

### `CORS error` in browser (Frontend → Backend)
The backend CORS origin is set to `http://localhost:5173`. If your frontend runs on a different port, update the `origin` in `Backend/server.js`.

### ML Server model not found
If `ML-Server/voice/model/voice_uci_model.pkl` is missing, run the training script:
```bash
cd ML-Server/voice
python train_voice_dataset.py
```

---

## 📄 License

This project was developed as an academic research project for Parkinson's Disease early detection in Sri Lanka.
