import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Menentukan path absolut untuk database
# Ini penting agar PythonAnywhere tahu di mana harus menyimpan file database
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "booking.db")

# Inisialisasi aplikasi Flask
app = Flask(__name__)
CORS(app) # Mengizinkan request dari domain lain (website Anda)

# Fungsi untuk inisialisasi database
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Buat tabel 'bookings' jika belum ada
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            accommodation_type TEXT NOT NULL,
            check_in_date TEXT NOT NULL,
            check_out_date TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Route utama untuk cek apakah server berjalan
@app.route('/')
def home():
    return "Server booking Thé Ciliwung berjalan!"

# Route untuk menerima data booking
@app.route('/booking', methods=['POST'])
def handle_booking():
    data = request.get_json()

    if not data:
        return jsonify({"status": "error", "message": "Invalid data"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO bookings (accommodation_type, check_in_date, check_out_date, customer_name, email, phone)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data.get('type'),
            data.get('check_in'),
            data.get('check_out'),
            data.get('name'),
            data.get('email'),
            data.get('phone')
        ))
        conn.commit()
        conn.close()
        
        return jsonify({"status": "success", "message": "Booking request received!"})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": "Could not process booking"}), 500

# Inisialisasi database saat aplikasi pertama kali dijalankan
with app.app_context():
    init_db()

