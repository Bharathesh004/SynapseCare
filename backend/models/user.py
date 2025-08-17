import sqlite3
import hashlib
import secrets
from datetime import datetime
import os

class UserModel:
    def __init__(self, db_path="users.db"):
        self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        """Initialize the database with users table"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def hash_password(self, password):
        """Hash password with salt"""
        salt = secrets.token_hex(32)
        password_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return password_hash.hex(), salt
    
    def verify_password(self, password, password_hash, salt):
        """Verify password against hash"""
        return password_hash == hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        ).hex()
    
    def create_user(self, first_name, last_name, email, phone, password):
        """Create a new user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Check if user already exists
            cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
            if cursor.fetchone():
                return {"success": False, "message": "Email already registered"}
            
            # Hash password
            password_hash, salt = self.hash_password(password)
            
            # Insert user
            cursor.execute('''
                INSERT INTO users (first_name, last_name, email, phone, password_hash, salt)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (first_name, last_name, email, phone, password_hash, salt))
            
            user_id = cursor.lastrowid
            conn.commit()
            
            return {
                "success": True, 
                "message": "User created successfully",
                "user_id": user_id
            }
            
        except sqlite3.Error as e:
            return {"success": False, "message": f"Database error: {str(e)}"}
        finally:
            conn.close()
    
    def authenticate_user(self, email, password):
        """Authenticate user login"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT id, first_name, last_name, email, phone, password_hash, salt, is_active
                FROM users WHERE email = ?
            ''', (email,))
            
            user = cursor.fetchone()
            
            if not user:
                return {"success": False, "message": "Invalid email or password"}
            
            user_id, first_name, last_name, email, phone, password_hash, salt, is_active = user
            
            if not is_active:
                return {"success": False, "message": "Account is deactivated"}
            
            # Verify password
            if self.verify_password(password, password_hash, salt):
                return {
                    "success": True,
                    "message": "Login successful",
                    "user": {
                        "id": user_id,
                        "first_name": first_name,
                        "last_name": last_name,
                        "email": email,
                        "phone": phone
                    }
                }
            else:
                return {"success": False, "message": "Invalid email or password"}
                
        except sqlite3.Error as e:
            return {"success": False, "message": f"Database error: {str(e)}"}
        finally:
            conn.close()
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT id, first_name, last_name, email, phone, created_at
                FROM users WHERE id = ? AND is_active = 1
            ''', (user_id,))
            
            user = cursor.fetchone()
            
            if user:
                return {
                    "success": True,
                    "user": {
                        "id": user[0],
                        "first_name": user[1],
                        "last_name": user[2],
                        "email": user[3],
                        "phone": user[4],
                        "created_at": user[5]
                    }
                }
            else:
                return {"success": False, "message": "User not found"}
                
        except sqlite3.Error as e:
            return {"success": False, "message": f"Database error: {str(e)}"}
        finally:
            conn.close()
    
    def update_user(self, user_id, **kwargs):
        """Update user information"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Build dynamic update query
            update_fields = []
            values = []
            
            for field, value in kwargs.items():
                if field in ['first_name', 'last_name', 'email', 'phone'] and value is not None:
                    update_fields.append(f"{field} = ?")
                    values.append(value)
            
            if not update_fields:
                return {"success": False, "message": "No valid fields to update"}
            
            update_fields.append("updated_at = ?")
            values.append(datetime.now().isoformat())
            values.append(user_id)
            
            query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?"
            cursor.execute(query, values)
            
            if cursor.rowcount == 0:
                return {"success": False, "message": "User not found"}
            
            conn.commit()
            return {"success": True, "message": "User updated successfully"}
            
        except sqlite3.Error as e:
            return {"success": False, "message": f"Database error: {str(e)}"}
        finally:
            conn.close()