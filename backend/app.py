# backend/app.py
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import pickle
import pandas as pd
from routes.auth import auth_bp
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS with credentials for sessions

# Configure session
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['SESSION_TYPE'] = 'filesystem'

# Register auth blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

# Load model & feature names
try:
    with open("model.pkl", "rb") as f:
        model, feature_names = pickle.load(f)
    print("Model loaded successfully!")
except FileNotFoundError:
    print("Error: model.pkl file not found!")
    model, feature_names = None, None

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "SynapseCare API is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
        
    data = request.json  # JSON input
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        print("Received data:", data)  # Debug log
        
        # Convert input to DataFrame
        df = pd.DataFrame([data])
        
        # Handle categorical variables (if any)
        df = pd.get_dummies(df)
        
        # Add missing columns from training
        for col in feature_names:
            if col not in df.columns:
                df[col] = 0
        
        # Ensure same column order as training data
        df = df[feature_names]
        
        print("Processed DataFrame shape:", df.shape)  # Debug log
        print("DataFrame columns:", df.columns.tolist())  # Debug log
        
        # Get prediction and probabilities
        prediction = model.predict(df)[0]
        probabilities = model.predict_proba(df)[0]
        
        # Calculate risk level based on probability
        risk_probability = float(probabilities[1]) if len(probabilities) > 1 else float(probabilities[0])
        
        # Determine risk level
        if risk_probability >= 0.7:
            risk_level = "High"
        elif risk_probability >= 0.4:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        # Generate recommendations based on risk level
        recommendations = get_recommendations(risk_level, data)
        
        return jsonify({
            "prediction": int(prediction),
            "probability": risk_probability,
            "risk_level": risk_level,
            "risk_percentage": round(risk_probability * 100, 2),
            "recommendations": recommendations,
            "status": "success"
        })
    except Exception as e:
        print("Error in prediction:", str(e))  # Debug log
        return jsonify({"error": str(e)}), 400

def get_recommendations(risk_level, user_data):
    """Generate personalized recommendations based on risk level and user data"""
    base_recommendations = {
        "High": [
            "Consult with a healthcare professional immediately",
            "Monitor blood glucose levels daily",
            "Follow a strict diabetes-friendly diet",
            "Engage in supervised physical activity",
            "Consider medication as prescribed by your doctor"
        ],
        "Medium": [
            "Schedule regular check-ups with your healthcare provider",
            "Maintain a balanced diet with limited refined sugars",
            "Exercise regularly (at least 150 minutes per week)",
            "Monitor your weight and BMI regularly",
            "Manage stress through relaxation techniques"
        ],
        "Low": [
            "Continue maintaining healthy eating habits",
            "Stay physically active with regular exercise",
            "Keep up with routine health screenings",
            "Maintain a healthy weight",
            "Stay informed about diabetes prevention"
        ]
    }
    
    recommendations = base_recommendations.get(risk_level, base_recommendations["Low"])
    
    # Add personalized recommendations based on user data
    try:
        bmi = float(user_data.get('BMI', 0))
        if bmi > 30:
            recommendations.append("Focus on weight management - consider consulting a nutritionist")
        
        if user_data.get('smoking_status') != 'never':
            recommendations.append("Consider smoking cessation programs")
        
        if int(user_data.get('physical_activity', 1)) < 3:
            recommendations.append("Gradually increase your physical activity level")
            
        glucose = float(user_data.get('Glucose', 0))
        if glucose > 125:
            recommendations.append("Monitor fasting glucose levels more frequently")
            
    except (ValueError, TypeError):
        pass  # Skip personalized recommendations if data conversion fails
    
    return recommendations

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)