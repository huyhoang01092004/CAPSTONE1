"""
Database configuration for AI Service
"""
import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.host = os.getenv('DB_HOST', '127.0.0.1')
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASS', 'root')
        self.database = os.getenv('DB_NAME', 'clinic_management')
        self.connection = None
    
    def connect(self):
        """Kết nối đến MySQL database"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            if self.connection.is_connected():
                print(f"[OK] Ket noi MySQL database: {self.database}")
                return self.connection
        except Error as e:
            print(f"[FAIL] Loi ket noi MySQL: {e}")
            return None
    
    def disconnect(self):
        """Ngắt kết nối database"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("[OK] Da ngat ket noi MySQL")
    
    def execute_query(self, query, params=None):
        """Thực thi SELECT query"""
        try:
            if not self.connection or not self.connection.is_connected():
                print("[WARN] Database not connected, attempting to reconnect...")
                self.connect()
            
            if not self.connection:
                print("[FAIL] Connection is still None after reconnect attempt")
                return None
            
            cursor = self.connection.cursor(dictionary=True)
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            result = cursor.fetchall()
            cursor.close()
            print(f"[DEBUG] Query executed, returned {len(result) if result else 0} rows")
            return result
        except Error as e:
            print(f"[FAIL] Loi query: {e}")
            return None
    
    def execute_insert(self, query, params=None):
        """Thực thi INSERT query"""
        try:
            cursor = self.connection.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            self.connection.commit()
            last_id = cursor.lastrowid
            cursor.close()
            return last_id
        except Error as e:
            print(f"[FAIL] Loi insert: {e}")
            self.connection.rollback()
            return None

# Singleton instance
db = Database()
