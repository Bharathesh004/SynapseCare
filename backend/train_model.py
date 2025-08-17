# backend/train_model.py
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Load dataset
df = pd.read_csv("data/diabetes_extended_ordered.csv")

# Features & Target
X = df.drop("Outcome", axis=1)
y = df["Outcome"]

# One-hot encode categorical columns
X = pd.get_dummies(X, drop_first=True)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
with open("model.pkl", "wb") as f:
    pickle.dump((model, X.columns.tolist()), f)

print("✅ Model trained and saved as model.pkl")
