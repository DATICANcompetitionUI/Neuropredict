import os
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Stroke Prediction API", version="1.0.0")

# Allow your Next.js frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your Netlify URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Load all model artifacts on startup
# ============================================================
# Use Path(__file__).parent so it works no matter where
# uvicorn is launched from (local dev, Render, etc.)
ARTIFACTS_DIR = Path(__file__).parent / "model_artifacts"

print(f"Loading model artifacts from: {ARTIFACTS_DIR}")
print(f"Directory exists: {ARTIFACTS_DIR.exists()}")
if ARTIFACTS_DIR.exists():
    print(f"Files: {list(ARTIFACTS_DIR.iterdir())}")

def load_artifact(filename: str):
    """Load a single artifact from the model_artifacts directory."""
    path = ARTIFACTS_DIR / filename
    if not path.exists():
        raise FileNotFoundError(
            f"Model artifact not found: {path}\n"
            f"Make sure you have run 'python train.py' and committed "
            f"the model_artifacts/ folder to Git."
        )
    with open(path, "rb") as f:
        return joblib.load(f)

model_rf = load_artifact("model_rf.pkl")
model_xgb = load_artifact("model_xgb.pkl")
model_lr = load_artifact("model_lr.pkl")
model_mlp = load_artifact("model_mlp.pkl")
scaler = load_artifact("scaler.pkl")
label_encoders = load_artifact("label_encoders.pkl")
feature_names = load_artifact("feature_names.pkl")

# SHAP explainer (optional)
HAS_SHAP = False
try:
    shap_explainer = load_artifact("shap_explainer.pkl")
    HAS_SHAP = True
    print("SHAP explainer loaded successfully.")
except FileNotFoundError:
    print("SHAP explainer not found — will use XGBoost feature importance as fallback.")
except Exception as e:
    print(f"SHAP explainer could not be loaded: {e}")
    print("SHAP values will use XGBoost feature importance as fallback.")

print("All model artifacts loaded successfully!")


# ============================================================
# Health check
# ============================================================
@app.get("/health")
def health():
    return {
        "status": "ok",
        "models_loaded": True,
        "features": feature_names,
        "shap_enabled": HAS_SHAP
    }


# ============================================================
# Main prediction endpoint
# ============================================================
@app.post("/predict")
def predict(data: dict):
    """
    Receives patient data from the frontend and returns:
    - Ensemble risk score (%)
    - Risk level (low/moderate/high/critical)
    - Per-model results
    - SHAP feature contributions
    - Personalized recommendations
    """
    # 1. Build DataFrame from input
    input_dict = {
        "gender": data["gender"],
        "age": float(data["age"]),
        "hypertension": int(data["hypertension"]),
        "heart_disease": int(data["heart_disease"]),
        "ever_married": data["ever_married"],
        "work_type": data["work_type"],
        "Residence_type": data["residence_type"],
        "avg_glucose_level": float(data["avg_glucose_level"]),
        "bmi": float(data["bmi"]),
        "smoking_status": data["smoking_status"]
    }
    df = pd.DataFrame([input_dict])

    # 2. Apply LabelEncoders (same ones from training)
    for col, encoder in label_encoders.items():
        if col in df.columns:
            val = df[col].iloc[0]
            if val in encoder.classes_:
                df[col] = encoder.transform(df[col])
            else:
                df[col] = -1  # unseen category

    # 3. Scale numerical features
    numerical_cols = ["age", "avg_glucose_level", "bmi"]
    df[numerical_cols] = scaler.transform(df[numerical_cols])

    # 4. Reorder columns to match training order
    df = df[feature_names]

    # 5. Get predictions from all 4 models
    models = {
        "Random Forest": model_rf,
        "XGBoost": model_xgb,
        "Logistic Regression": model_lr,
        "Neural Network": model_mlp
    }

    model_results = []
    for name, model in models.items():
        prob = float(model.predict_proba(df)[0][1]) * 100
        model_results.append({
            "name": name,
            "probability": round(prob, 1)
        })

    # Ensemble: weighted average (XGBoost gets slightly more weight)
    weights = {"Random Forest": 1.0, "XGBoost": 1.3, "Logistic Regression": 0.8, "Neural Network": 1.0}
    weighted_prob = sum(r["probability"] * weights[r["name"]] for r in model_results)
    total_weight = sum(weights.values())
    risk_score = round(weighted_prob / total_weight, 1)

    # 6. SHAP values
    shap_values = []
    if HAS_SHAP:
        try:
            shap_vals = shap_explainer.shap_values(df)
            # Binary classification: take values for class 1 (stroke)
            if isinstance(shap_vals, list):
                sv = shap_vals[1][0]
            else:
                sv = shap_vals[0]

            for i, fname in enumerate(feature_names):
                shap_values.append({
                    "feature": format_feature_name(fname),
                    "value": round(float(sv[i]), 4)
                })
        except Exception as e:
            print(f"SHAP computation failed: {e}")
            # Fallback: use feature importance from XGBoost
            try:
                importance = model_xgb.feature_importances_
                for i, fname in enumerate(feature_names):
                    shap_values.append({
                        "feature": format_feature_name(fname),
                        "value": round(float(importance[i]), 4)
                    })
            except:
                pass
    else:
        # Fallback: XGBoost feature importance
        try:
            importance = model_xgb.feature_importances_
            for i, fname in enumerate(feature_names):
                shap_values.append({
                    "feature": format_feature_name(fname),
                    "value": round(float(importance[i]), 4)
                })
        except:
            pass

    # 7. Risk level
    if risk_score < 20:
        risk_level = "low"
    elif risk_score < 50:
        risk_level = "moderate"
    elif risk_score < 75:
        risk_level = "high"
    else:
        risk_level = "critical"

    # 8. Generate recommendations
    recommendations = generate_recommendations(data, risk_level)

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "shap_values": shap_values,
        "model_results": model_results,
        "recommendations": recommendations
    }


# ============================================================
# Helpers
# ============================================================
FEATURE_NAME_MAP = {
    "gender": "Gender",
    "age": "Age",
    "hypertension": "Hypertension",
    "heart_disease": "Heart Disease",
    "ever_married": "Ever Married",
    "work_type": "Work Type",
    "Residence_type": "Residence Type",
    "avg_glucose_level": "Avg Glucose Level",
    "bmi": "BMI",
    "smoking_status": "Smoking Status"
}


def format_feature_name(name: str) -> str:
    return FEATURE_NAME_MAP.get(name, name)


def generate_recommendations(data: dict, risk_level: str) -> list:
    recs = []

    if float(data.get("avg_glucose_level", 0)) > 150:
        recs.append({
            "category": "Blood Sugar",
            "icon": "droplets",
            "text": "Your glucose level is elevated. Consider dietary changes, regular exercise, and consult a doctor about diabetes screening."
        })

    if float(data.get("bmi", 0)) > 30:
        recs.append({
            "category": "Weight Management",
            "icon": "scale",
            "text": "Your BMI indicates obesity, a major stroke risk factor. A structured weight loss program can significantly reduce your risk."
        })

    if int(data.get("hypertension", 0)) == 1:
        recs.append({
            "category": "Blood Pressure",
            "icon": "heart-pulse",
            "text": "Hypertension is the leading cause of stroke. Ensure regular BP monitoring and adherence to prescribed medication."
        })

    if int(data.get("heart_disease", 0)) == 1:
        recs.append({
            "category": "Heart Health",
            "icon": "heart",
            "text": "Heart disease increases stroke risk. Regular cardiac check-ups and following your cardiologist's advice is essential."
        })

    if data.get("smoking_status") in ["smokes", "formerly smoked"]:
        recs.append({
            "category": "Smoking Cessation",
            "icon": "cigarette-off",
            "text": "Smoking doubles your stroke risk. Quitting smoking, even after years, significantly reduces this risk over time."
        })

    if float(data.get("age", 0)) > 55:
        recs.append({
            "category": "Age Awareness",
            "icon": "calendar",
            "text": "Stroke risk increases with age. Regular health screenings and maintaining an active lifestyle become even more important."
        })

    if risk_level in ["high", "critical"]:
        recs.append({
            "category": "Immediate Action",
            "icon": "alert-triangle",
            "text": "Your overall risk is elevated. Please consult a healthcare professional for a comprehensive cardiovascular assessment."
        })

    if len(recs) == 0:
        recs.append({
            "category": "Healthy Living",
            "icon": "shield-check",
            "text": "Your risk profile looks good! Maintain a healthy diet, exercise regularly, and schedule routine check-ups."
        })

    return recs