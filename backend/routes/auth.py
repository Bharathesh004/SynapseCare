from flask import Blueprint, request, jsonify, session
from models.user import UserModel
import re

auth_bp = Blueprint('auth', __name__)
user_model = UserModel()

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain at least one letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.json
        
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400
        
        # Extract and validate required fields
        first_name = data.get('firstName', '').strip()
        last_name = data.get('lastName', '').strip()
        email = data.get('email', '').strip().lower()
        phone = data.get('phone', '').strip()
        password = data.get('password', '')
        confirm_password = data.get('confirmPassword', '')
        agree_to_terms = data.get('agreeToTerms', False)
        
        # Validation
        if not all([first_name, last_name, email, password]):
            return jsonify({
                "success": False, 
                "message": "All required fields must be filled"
            }), 400
        
        if not validate_email(email):
            return jsonify({
                "success": False, 
                "message": "Invalid email format"
            }), 400
        
        if password != confirm_password:
            return jsonify({
                "success": False, 
                "message": "Passwords do not match"
            }), 400
        
        is_valid, password_message = validate_password(password)
        if not is_valid:
            return jsonify({
                "success": False, 
                "message": password_message
            }), 400
        
        if not agree_to_terms:
            return jsonify({
                "success": False, 
                "message": "You must agree to the terms and conditions"
            }), 400
        
        # Create user
        result = user_model.create_user(first_name, last_name, email, phone, password)
        
        if result["success"]:
            return jsonify({
                "success": True,
                "message": "Registration successful! You can now log in.",
                "user_id": result["user_id"]
            }), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            "success": False, 
            "message": f"Registration failed: {str(e)}"
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.json
        
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        remember_me = data.get('rememberMe', False)
        
        # Validation
        if not email or not password:
            return jsonify({
                "success": False, 
                "message": "Email and password are required"
            }), 400
        
        if not validate_email(email):
            return jsonify({
                "success": False, 
                "message": "Invalid email format"
            }), 400
        
        # Authenticate user
        result = user_model.authenticate_user(email, password)
        
        if result["success"]:
            # Store user session
            session['user_id'] = result["user"]["id"]
            session['user_email'] = result["user"]["email"]
            session.permanent = remember_me
            
            return jsonify({
                "success": True,
                "message": "Login successful!",
                "user": result["user"]
            }), 200
        else:
            return jsonify(result), 401
            
    except Exception as e:
        return jsonify({
            "success": False, 
            "message": f"Login failed: {str(e)}"
        }), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """User logout endpoint"""
    try:
        session.clear()
        return jsonify({
            "success": True,
            "message": "Logout successful"
        }), 200
    except Exception as e:
        return jsonify({
            "success": False, 
            "message": f"Logout failed: {str(e)}"
        }), 500

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get user profile endpoint"""
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({
                "success": False, 
                "message": "Not authenticated"
            }), 401
        
        result = user_model.get_user_by_id(user_id)
        
        if result["success"]:
            return jsonify({
                "success": True,
                "user": result["user"]
            }), 200
        else:
            return jsonify(result), 404
            
    except Exception as e:
        return jsonify({
            "success": False, 
            "message": f"Failed to get profile: {str(e)}"
        }), 500

@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    """Update user profile endpoint"""
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({
                "success": False, 
                "message": "Not authenticated"
            }), 401
        
        data = request.json
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400
        
        # Extract updateable fields
        update_data = {}
        for field in ['first_name', 'last_name', 'email', 'phone']:
            if field in data and data[field]:
                if field == 'email':
                    email = data[field].strip().lower()
                    if not validate_email(email):
                        return jsonify({
                            "success": False, 
                            "message": "Invalid email format"
                        }), 400
                    update_data[field] = email
                else:
                    update_data[field] = data[field].strip()
        
        if not update_data:
            return jsonify({
                "success": False, 
                "message": "No valid fields to update"
            }), 400
        
        result = user_model.update_user(user_id, **update_data)
        
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            "success": False, 
            "message": f"Failed to update profile: {str(e)}"
        }), 500

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    try:
        user_id = session.get('user_id')
        
        if user_id:
            result = user_model.get_user_by_id(user_id)
            if result["success"]:
                return jsonify({
                    "success": True,
                    "authenticated": True,
                    "user": result["user"]
                }), 200
        
        return jsonify({
            "success": True,
            "authenticated": False
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False, 
            "message": f"Auth check failed: {str(e)}"
        }), 500