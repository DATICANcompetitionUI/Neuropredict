# Stroke Prediction API Backend

FastAPI backend serving 4 trained ML models (Random Forest, XGBoost, Logistic Regression, Neural Network) with SHAP explainability for stroke prediction.

## Quick Start (Local)

### Prerequisites
- Python 3.9+
- pip

### Step 1: Extract model artifacts

You must have trained models from Google Colab. Extract your `model_artifacts.zip` (downloaded from Colab) into the `model_artifacts/` folder.

```
stroke-backend/
├── main.py
├── requirements.txt
├── Procfile
└── model_artifacts/
    ├── model_rf.pkl
    ├── model_xgb.pkl
    ├── model_lr.pkl
    ├── model_mlp.pkl
    ├── scaler.pkl
    ├── label_encoders.pkl
    ├── shap_explainer.pkl
    └── feature_names.pkl
```

### Step 2: Create virtual environment

```bash
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
```

### Step 3: Install dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Run the server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Server runs at: **http://localhost:8000**

### Step 5: Test

```bash
# Health check
curl http://localhost:8000/health

# Test prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"gender":"Male","age":67,"hypertension":1,"heart_disease":0,"ever_married":"Yes","work_type":"Private","residence_type":"Urban","avg_glucose_level":228.69,"bmi":36.6,"smoking_status":"formerly smoked"}'
```

## API Endpoints

| Method | Path     | Description            |
|--------|----------|------------------------|
| GET    | /health  | Health check           |
| POST   | /predict | Stroke prediction      |

## Deploy to Render (Free)

1. Push this folder to GitHub (keep .pkl files in model_artifacts/)
2. Go to [render.com](https://render.com)
3. New Web Service → Connect repo
4. Settings:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy
6. Copy the URL and set it as `BACKEND_URL` in your frontend

## Deploy to Railway (Free)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Auto-detects Procfile