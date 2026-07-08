"""
train.py — Train all ML models locally
Run this ONCE after placing healthcare-dataset-stroke-data.csv in the same folder.

Usage:
    python train.py
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import f1_score, roc_auc_score, classification_report

# Check for XGBoost
try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    print("XGBoost not installed. Install with: pip install xgboost")
    HAS_XGB = False

# Check for SHAP
try:
    import shap
    HAS_SHAP = True
except ImportError:
    print("SHAP not installed. Install with: pip install shap")
    HAS_SHAP = False

# Check for imbalanced-learn
try:
    from imblearn.over_sampling import SMOTE
    HAS_SMOTE = True
except ImportError:
    print("imbalanced-learn not installed. Install with: pip install imbalanced-learn")
    HAS_SMOTE = False

# Check for imbalanced-learn
try:
    from imblearn.over_sampling import SMOTE
    HAS_SMOTE = True
except ImportError:
    print("WARNING: imbalanced-learn not found. Using random oversampling instead.")
    HAS_SMOTE = False


def main():
    # ============================================================
    # 1. Load Data
    # ============================================================
    csv_path = "healthcare-dataset-stroke-data.csv"
    if not os.path.exists(csv_path):
        print(f"\nERROR: {csv_path} not found!")
        print("Download it from: https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset")
        print("Place it in the same folder as this script.")
        return

    print("=" * 50)
    print("  Stroke Prediction — Model Training")
    print("=" * 50)

    df = pd.read_csv(csv_path)
    print(f"\nDataset loaded: {df.shape[0]} rows x {df.shape[1]} columns")
    print(f"Stroke cases: {df['stroke'].sum()} ({df['stroke'].mean()*100:.1f}%)")
    print(f"Missing BMI: {df['bmi'].isnull().sum()}")

    # ============================================================
    # 2. Preprocess
    # ============================================================
    df = df.drop('id', axis=1)
    df['bmi'] = df['bmi'].fillna(df['bmi'].median())

    cat_cols = ['gender', 'ever_married', 'work_type', 'Residence_type', 'smoking_status']
    label_encoders = {}
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le

    print(f"\nPreprocessing complete. Encoded {len(cat_cols)} categorical columns.")

    # ============================================================
    # 3. Handle Imbalance
    # ============================================================
    X = df.drop('stroke', axis=1)
    y = df['stroke']
    feature_names = list(X.columns)

    if HAS_SMOTE:
        smote = SMOTE(random_state=42)
        X_resampled, y_resampled = smote.fit_resample(X, y)
        print(f"SMOTE applied: {X_resampled.shape[0]} samples ({y_resampled.mean()*100:.0f}% positive)")
    else:
        # Simple random oversampling fallback
        from sklearn.utils import resample
        pos = X[y == 1]
        neg = X[y == 0]
        pos_upsampled = resample(pos, replace=True, n_samples=len(neg), random_state=42)
        X_resampled = pd.concat([neg, pos_upsampled])
        y_resampled = pd.concat([pd.Series([0]*len(neg)), pd.Series([1]*len(pos_upsampled))])
        print(f"Random oversampling: {X_resampled.shape[0]} samples ({y_resampled.mean()*100:.0f}% positive)")

    X_train, X_test, y_train, y_test = train_test_split(
        X_resampled, y_resampled, test_size=0.2, random_state=42
    )

    numerical_cols = ['age', 'avg_glucose_level', 'bmi']
    scaler = StandardScaler()
    X_train[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
    X_test[numerical_cols] = scaler.transform(X_test[numerical_cols])

    print(f"Train: {X_train.shape[0]}, Test: {X_test.shape[0]}")

    # ============================================================
    # 4. Train Models
    # ============================================================
    print("\n" + "=" * 50)
    print("  Training Models")
    print("=" * 50)

    # Random Forest
    print("\n[1/4] Random Forest...")
    model_rf = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
    model_rf.fit(X_train, y_train)
    rf_f1 = f1_score(y_test, model_rf.predict(X_test))
    rf_auc = roc_auc_score(y_test, model_rf.predict_proba(X_test)[:, 1])
    print(f"  F1: {rf_f1:.4f} | AUC: {rf_auc:.4f}")

    # XGBoost
    if HAS_XGB:
        print("\n[2/4] XGBoost...")
        model_xgb = XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.1, random_state=42, eval_metric='logloss')
        model_xgb.fit(X_train, y_train)
        xgb_f1 = f1_score(y_test, model_xgb.predict(X_test))
        xgb_auc = roc_auc_score(y_test, model_xgb.predict_proba(X_test)[:, 1])
        print(f"  F1: {xgb_f1:.4f} | AUC: {xgb_auc:.4f}")
    else:
        model_xgb = model_rf  # fallback to RF
        print("\n[2/4] XGBoost skipped (not installed)")

    # Logistic Regression
    print("\n[3/4] Logistic Regression...")
    model_lr = LogisticRegression(max_iter=1000, random_state=42)
    model_lr.fit(X_train, y_train)
    lr_f1 = f1_score(y_test, model_lr.predict(X_test))
    lr_auc = roc_auc_score(y_test, model_lr.predict_proba(X_test)[:, 1])
    print(f"  F1: {lr_f1:.4f} | AUC: {lr_auc:.4f}")

    # Neural Network
    print("\n[4/4] Neural Network (MLP)...")
    model_mlp = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=500, random_state=42)
    model_mlp.fit(X_train, y_train)
    mlp_f1 = f1_score(y_test, model_mlp.predict(X_test))
    mlp_auc = roc_auc_score(y_test, model_mlp.predict_proba(X_test)[:, 1])
    print(f"  F1: {mlp_f1:.4f} | AUC: {mlp_auc:.4f}")

    # ============================================================
    # 5. SHAP
    # ============================================================
    explainer = None
    if HAS_SHAP and HAS_XGB:
        try:
            print("\nComputing SHAP values...")
            explainer = shap.TreeExplainer(model_xgb)
            _ = explainer.shap_values(X_test.head(5))  # test it works
            print("SHAP explainer ready.")
        except Exception as e:
            print(f"SHAP failed: {e}")
            explainer = None
    else:
        print("\nSHAP skipped (missing xgboost or shap)")

    # ============================================================
    # 6. Save Everything
    # ============================================================
    os.makedirs('model_artifacts', exist_ok=True)

    joblib.dump(model_rf, 'model_artifacts/model_rf.pkl')
    joblib.dump(model_xgb, 'model_artifacts/model_xgb.pkl')
    joblib.dump(model_lr, 'model_artifacts/model_lr.pkl')
    joblib.dump(model_mlp, 'model_artifacts/model_mlp.pkl')
    joblib.dump(scaler, 'model_artifacts/scaler.pkl')
    joblib.dump(label_encoders, 'model_artifacts/label_encoders.pkl')
    joblib.dump(feature_names, 'model_artifacts/feature_names.pkl')

    if explainer:
        joblib.dump(explainer, 'model_artifacts/shap_explainer.pkl')

    print("\n" + "=" * 50)
    print("  All models saved to model_artifacts/")
    print("=" * 50)
    for f in sorted(os.listdir('model_artifacts')):
        size = os.path.getsize(f'model_artifacts/{f}') / 1024
        print(f"  {f} ({size:.1f} KB)")

    print("\nDone! Now run: uvicorn main:app --port 8000")


if __name__ == "__main__":
    main()