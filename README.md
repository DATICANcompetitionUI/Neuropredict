
# NeuroPredict AI

**Intelligent Stroke Risk Assessment Using Explainable Machine Learning**
<img width="1613" height="863" alt="Screenshot 2026-07-08 182750" src="https://github.com/user-attachments/assets/08dfe03d-0779-4b35-85f8-f884d5901de9" />
<img width="1602" height="862" alt="Screenshot 2026-07-08 182924" src="https://github.com/user-attachments/assets/952522cf-7efe-4684-96f5-7836fc8d1a92" />
<img width="1620" height="860" alt="Screenshot 2026-07-08 183017" src="https://github.com/user-attachments/assets/e4dba84e-ba1d-45d8-9c47-9431407e023d" />
<img width="1603" height="852" alt="Screenshot 2026-07-08 183133" src="https://github.com/user-attachments/assets/236e03f0-8015-46bb-b064-cd83c513239c" />
<img width="1617" height="860" alt="Screenshot 2026-07-08 183220" src="https://github.com/user-attachments/assets/103f88d7-c222-45a4-9b00-a8b5e878d398" />





![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![License](https://img.shields.io/badge/License-MIT-green)

> Built for the **Undergraduate Students' Competition in the Application of Artificial Intelligence in Medicine** — NACOS UI + DATICAN + University of Ibadan, 2026.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Architecture](#architecture)
- [ML Pipeline](#ml-pipeline)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Training the Models](#training-the-models)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Team](#team)
- [License](#license)

---

## Overview

NeuroPredict AI is a full-stack web application that predicts stroke risk using an ensemble of four machine learning models. The system provides **transparent, explainable predictions** powered by SHAP (SHapley Additive exPlanations), allowing clinicians and patients to understand exactly which factors contribute to an individual's stroke risk.

The platform features a real-time risk gauge, interactive what-if scenario simulator, comprehensive analytics dashboard, and educational resources — all wrapped in a modern, responsive medical-grade user interface.

### Why This Project?

Stroke remains the second leading cause of death globally, with over 130,000 deaths annually in Nigeria alone. Early identification of at-risk individuals enables timely intervention and preventive care. NeuroPredict AI bridges the gap between complex ML models and clinical usability by providing:

- **Explainable predictions** — not black-box outputs
- **Multi-model consensus** — four independent models for robust predictions
- **Interactive exploration** — what-if analysis to understand risk modification
- **Clinical-grade UI** — designed for healthcare professionals and patients

---

## Live Demo

🌐 **[View Deployed Application](https://neuroanalyst.netlify.app)** *(Update after deployment)*

---

## Features

### 🧠 AI/ML Prediction Engine
- **4-Model Ensemble**: Random Forest, XGBoost, Logistic Regression, and Neural Network (MLP)
- **SMOTE Oversampling**: Handles class imbalance (4.9% positive → 50/50 balanced training)
- **Weighted Ensemble**: XGBoost-weighted averaging for optimal prediction accuracy
- **SHAP Explainability**: Per-feature contribution analysis with interactive visualization

### 📊 Real-Time Risk Gauge
- Animated circular gauge with color-coded risk levels (green/yellow/red)
- Updates instantly as user types — provides immediate visual feedback
- Canvas-rendered at 60fps for smooth animations

### 🔬 Results Dashboard
- SHAP horizontal bar chart showing feature contributions
- Side-by-side model comparison with confidence badges
- Personalized health recommendations based on risk factors

### 🎮 What-If Simulator
- Interactive sliders for glucose, BMI, and age
- Toggle switches for hypertension, heart disease, and smoking
- Real-time risk reduction calculation — shows impact of lifestyle changes

### 📈 Analytics Dashboard
- Stroke rate distribution by age group
- Global feature importance ranking
- Gender and smoking status distribution charts
- All data sourced from the Kaggle Stroke Prediction Dataset (5,110 patients)

### 🎓 Education Section
- FAST acronym awareness cards (Face, Arm, Speech, Time)
- Comprehensive risk factor education
- Prevention strategies and lifestyle recommendations
- 6-step ML methodology explanation

### 🌙 Additional Features
- Dark/Light mode toggle
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations powered by Framer Motion
- Glassmorphism navigation bar
- Server connection error handling with troubleshooting guide

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 16)                  │
│                    Hosted on Netlify                      │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │  React   │  │ Tailwind │  │  Recharts + Framer    │  │
│  │  19      │  │  CSS 4   │  │  Motion + shadcn/ui   │  │
│  └────┬─────┘  └────┬─────┘  └───────────┬───────────┘  │
│       └──────────────┼────────────────────┘              │
│                      │                                   │
│           ┌──────────▼──────────┐                        │
│           │  /api/predict Route │                        │
│           │  (Next.js API)      │                        │
│           └──────────┬──────────┘                        │
└──────────────────────┼───────────────────────────────────┘
                       │  HTTP POST
                       │
┌──────────────────────▼───────────────────────────────────┐
│                   BACKEND (FastAPI)                       │
│                   Hosted on Render                        │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │              Model Loading Layer                  │    │
│  │  model_rf.pkl  model_xgb.pkl  model_lr.pkl       │    │
│  │  model_mlp.pkl  scaler.pkl  label_encoders.pkl   │    │
│  │  shap_explainer.pkl  feature_names.pkl           │    │
│  └──────────────────────┬───────────────────────────┘    │
│                         │                                │
│  ┌──────────────────────▼───────────────────────────┐    │
│  │           Prediction Pipeline                     │    │
│  │  Input → LabelEncode → Scale → Predict → SHAP    │    │
│  └──────────────────────┬───────────────────────────┘    │
│                         │                                │
│  ┌──────────────────────▼───────────────────────────┐    │
│  │              Response Builder                     │    │
│  │  risk_score + risk_level + shap_values +         │    │
│  │  model_results + recommendations                 │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## ML Pipeline

### Dataset

| Property | Value |
|----------|-------|
| **Source** | [Kaggle Stroke Prediction Dataset](https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset) |
| **Author** | fedesoriano |
| **Samples** | 5,110 patients |
| **Features** | 10 (gender, age, hypertension, heart_disease, ever_married, work_type, residence_type, avg_glucose_level, bmi, smoking_status) |
| **Target** | stroke (0 = no stroke, 1 = stroke) |
| **Positive Cases** | 249 (4.9%) — heavily imbalanced |
| **Missing Values** | BMI: 201 NaN values |

### Preprocessing

1. **Missing Data**: BMI imputed with median value
2. **Categorical Encoding**: LabelEncoder applied to gender, ever_married, work_type, Residence_type, smoking_status
3. **Feature Scaling**: StandardScaler applied to age, avg_glucose_level, bmi
4. **Class Imbalance**: SMOTE (Synthetic Minority Over-sampling Technique) applied to balance the dataset from 4.9% to 50% positive class

### Models

| # | Model | Hyperparameters | Purpose |
|---|-------|----------------|---------|
| 1 | **Random Forest** | n_estimators=200, max_depth=10 | Robust baseline with low variance |
| 2 | **XGBoost** | n_estimators=200, max_depth=6, lr=0.1 | High-performance gradient boosting |
| 3 | **Logistic Regression** | max_iter=1000 | Interpretable linear model |
| 4 | **Neural Network (MLP)** | layers=(64, 32), max_iter=500 | Non-linear pattern capture |

### Ensemble Strategy

Predictions from all 4 models are combined using a **weighted average**:
- Random Forest: weight = 1.0
- **XGBoost: weight = 1.3** (highest performing model)
- Logistic Regression: weight = 0.8
- Neural Network: weight = 1.0

### Explainability

**SHAP (SHapley Additive exPlanations)** TreeExplainer is applied to the XGBoost model to compute per-feature contribution scores. This allows users to see exactly how much each health factor (age, glucose, BMI, etc.) contributes to their predicted risk.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with server-side API routes |
| [React 19](https://react.dev/) | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com/) | Pre-built accessible UI components |
| [Framer Motion](https://www.framer.com/motion/) | Animations and transitions |
| [Recharts](https://recharts.org/) | Data visualization charts |
| [Lucide React](https://lucide.dev/) | Icon library |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/Light mode |

### Backend
| Technology | Purpose |
|-----------|---------|
| [Python](https://python.org/) | Programming language |
| [FastAPI](https://fastapi.tiangolo.com/) | High-performance API framework |
| [Uvicorn](https://www.uvicorn.org/) | ASGI server |
| [scikit-learn](https://scikit-learn.org/) | ML models (RF, LR, MLP) + preprocessing |
| [XGBoost](https://xgboost.readthedocs.io/) | Gradient boosting model |
| [SHAP](https://shap.readthedocs.io/) | Model explainability |
| [imbalanced-learn](https://imbalanced-learn.org/) | SMOTE oversampling |
| [Pandas](https://pandas.pydata.org/) | Data manipulation |
| [NumPy](https://numpy.org/) | Numerical computing |
| [Joblib](https://joblib.readthedocs.io/) | Model serialization |

### Deployment
| Service | Purpose | Cost |
|---------|---------|------|
| [Netlify](https://netlify.com/) | Frontend hosting | Free |
| [Render](https://render.com/) | Backend hosting | Free |
| [Google Colab](https://colab.research.google.com/) | Model training | Free |

---

## Project Structure

```
Neuropredict/
├── frontend/                          # Next.js 16 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout, fonts, theme provider
│   │   │   ├── page.tsx               # Main page composing all sections
│   │   │   ├── globals.css            # Custom medical-themed color system
│   │   │   └── api/
│   │   │       └── predict/
│   │   │           └── route.ts       # API proxy to FastAPI backend
│   │   ├── components/
│   │   │   ├── stroke/
│   │   │   │   ├── navbar.tsx         # Sticky glassmorphism navigation
│   │   │   │   ├── hero.tsx           # Hero section with animated counters
│   │   │   │   ├── predict-section.tsx # Patient input form + error handling
│   │   │   │   ├── risk-gauge.tsx     # Canvas-rendered animated gauge
│   │   │   │   ├── results-dashboard.tsx # SHAP chart + model comparison
│   │   │   │   ├── analytics-dashboard.tsx # 4 data visualization charts
│   │   │   │   ├── what-if-simulator.tsx  # Interactive risk modifier
│   │   │   │   ├── education-section.tsx  # FAST signs + prevention
│   │   │   │   └── footer.tsx         # Links and attribution
│   │   │   └── ui/                    # shadcn/ui component library
│   │   └── lib/
│   │       └── stroke-prediction.ts   # Local risk estimation (live gauge)
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── postcss.config.mjs
│
├── backend/                           # FastAPI Python Backend
│   ├── main.py                        # API application with /health + /predict
│   ├── train.py                       # Model training script (run locally)
│   ├── requirements.txt               # Python dependencies
│   ├── Procfile                       # Render deployment configuration
│   ├── COLAB_TRAINING.md              # Google Colab step-by-step guide
│   ├── README.md                      # Backend-specific documentation
│   └── model_artifacts/               # Trained ML model files
│       ├── model_rf.pkl               # Random Forest
│       ├── model_xgb.pkl              # XGBoost
│       ├── model_lr.pkl               # Logistic Regression
│       ├── model_mlp.pkl              # Neural Network
│       ├── scaler.pkl                 # StandardScaler
│       ├── label_encoders.pkl         # Categorical encoders
│       ├── shap_explainer.pkl         # SHAP TreeExplainer
│       └── feature_names.pkl          # Feature column names
│
├── .gitignore
└── README.md                          # This file
```

---

## Local Setup

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Python** 3.9+ ([download](https://python.org/))
- **Git** ([download](https://git-scm.com/))
- Kaggle dataset: [healthcare-dataset-stroke-data.csv](https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset)

### 1. Clone the Repository

```bash
git clone https://github.com/DATICANcompetitionUI/Neuropredict.git
cd Neuropredict
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Place the CSV in this folder, then train models
python train.py

# Start the backend server
uvicorn main:app --port 8000
```

Verify: Open `http://localhost:8000/health` — should return `{"status":"ok"}`.

### 3. Setup Frontend

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Verify Connection

Fill the prediction form and click **"Run Full Analysis"**. The results should come from your real ML models. If the backend is not running, a clear error message will be displayed.

---

## Training the Models

### Option A: Train Locally

```bash
cd backend
python train.py
```

This trains all 4 models on your machine, ensuring version compatibility.

### Option B: Train on Google Colab

See [`backend/COLAB_TRAINING.md`](backend/COLAB_TRAINING.md) for the complete step-by-step Colab notebook.

**Steps:**
1. Download the CSV from [Kaggle](https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset)
2. Upload to [Google Colab](https://colab.research.google.com)
3. Run the training cells
4. Download the generated `model_artifacts.zip`
5. Extract into `backend/model_artifacts/`

> ⚠️ **Important**: Models trained on Colab may have version incompatibilities with your local Python environment. If you encounter `XGBoostError: input stream corrupted`, retrain locally using `python train.py`.

---

## Deployment

### Backend → Render (Free)

1. Push this repository to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect the GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy → Copy the URL (e.g., `https://neuropredict-api.onrender.com`)

### Frontend → Netlify (Free)

1. Go to [netlify.com](https://netlify.com) → **Add New Site** → **Import from Git**
2. Connect the GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
4. In **Site Settings** → **Environment Variables**, add:
   - `BACKEND_URL` = `https://neuropredict-api.onrender.com` *(your Render URL)*
5. Deploy!

> ⚠️ **Before deploying frontend**: Update `BACKEND_URL` in `frontend/src/app/api/predict/route.ts` from the hardcoded `http://localhost:8000` to `process.env.BACKEND_URL || ""`.

---

## API Documentation

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "models_loaded": true,
  "features": ["gender", "age", "hypertension", ...],
  "shap_enabled": true
}
```

### Stroke Prediction

```
POST /predict
Content-Type: application/json
```

**Request Body:**
```json
{
  "gender": "Male",
  "age": 67,
  "hypertension": 1,
  "heart_disease": 0,
  "ever_married": "Yes",
  "work_type": "Private",
  "residence_type": "Urban",
  "avg_glucose_level": 228.69,
  "bmi": 36.6,
  "smoking_status": "formerly smoked"
}
```

**Response:**
```json
{
  "risk_score": 73.2,
  "risk_level": "high",
  "shap_values": [
    { "feature": "Age", "value": 0.4521 },
    { "feature": "Avg Glucose Level", "value": 0.3201 },
    { "feature": "BMI", "value": 0.1502 }
  ],
  "model_results": [
    { "name": "Random Forest", "probability": 71.3 },
    { "name": "XGBoost", "probability": 78.5 },
    { "name": "Logistic Regression", "probability": 65.2 },
    { "name": "Neural Network", "probability": 72.8 }
  ],
  "recommendations": [
    {
      "category": "Blood Sugar",
      "icon": "droplets",
      "text": "Your glucose level is elevated..."
    }
  ]
}
```

---

## Screenshots

| Feature | Preview |
|---------|---------|
| Hero Section | ![Hero](https://via.placeholder.com/600x300?text=Hero+Section) |
| Prediction Form | ![Form](https://via.placeholder.com/600x300?text=Prediction+Form) |
| SHAP Results | ![SHAP](https://via.placeholder.com/600x300?text=SHAP+Results) |
| What-If Simulator | ![What-If](https://via.placeholder.com/600x300?text=What-If+Simulator) |

*(Replace placeholders with actual screenshots after deployment)*

---

## Team

**DATICAN Competition Team** — University of Ibadan

Undergraduate Students' Competition in the Application of Artificial Intelligence in Medicine, 2026.

---

## License

This project is developed for educational and competition purposes.

---

## Acknowledgements

- [Kaggle Stroke Prediction Dataset](https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset) by fedesoriano
- [SHAP Library](https://github.com/shap/shap) for model explainability
- [NACOS UI](https://nacosui.org/) + [DATICAN](https://datican.org/) for organizing the competition
- University of Ibadan, Department of Computer Science