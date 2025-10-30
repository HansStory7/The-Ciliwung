import sqlite3
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from io import StringIO
import csv

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

# Route untuk mendapatkan dan mengekspor data booking sebagai CSV
# Ini adalah solusi yang memungkinkan Anda mengunduh data untuk diimpor ke Excel/OneDrive
@app.route('/bookings/export/csv', methods=['GET'])
def export_bookings_csv():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Ambil semua data booking
        cursor.execute("SELECT * FROM bookings")
        rows = cursor.fetchall()
        
        # Ambil nama kolom
        column_names = [description[0] for description in cursor.description]
        
        conn.close()

        # Gunakan StringIO untuk membuat file di memori (agar tidak perlu membuat file fisik)
        csv_output = StringIO()
        csv_writer = csv.writer(csv_output)
        
        # Tulis header dan baris data
        csv_writer.writerow(column_names)
        csv_writer.writerows(rows)
        
        # Siapkan respons untuk download file CSV
        csv_output.seek(0)
        
        return send_file(
            csv_output,
            mimetype='text/csv',
            as_attachment=True,
            download_name='data_booking_theciliwung.csv'
        )

    except Exception as e:
        # Mencetak error ke console server
        print(f"Error during CSV export: {e}") 
        return jsonify({"status": "error", "message": "Gagal mengekspor data booking"}), 500


# Route untuk menerima data booking (Logika yang sudah ada)
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
        
        # [CATATAN]: Jika ingin sinkronisasi OneDrive otomatis, logika upload ke Microsoft Graph API akan diletakkan di sini.

        return jsonify({"status": "success", "message": "Booking request received!"})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": "Could not process booking"}), 500

# Inisialisasi database saat aplikasi pertama kali dijalankan
with app.app_context():
    init_db()
