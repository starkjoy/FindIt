from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import mysql.connector
from datetime import datetime

app = Flask(__name__)
cors = CORS(app)

# Configure MYSQL connection
db = mysql.connector.connect(
    host="localhost",
    user="FindIt",
    password="Pa$$w0rd!2023",
    database="ads"
)

# Check if 'ads' table exists, if not create it
def create_table():
    cursor = db.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        upload_time DATETIME NOT NULL
    );
    """)
    db.commit()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return 'No file part'
    
    file = request.files['file']
    
    if file.filename == '':
        return 'No selected file'
    
    if file:
        filename = os.path.join('static', file.filename)
        file.save(filename)

        try:
            cursor = db.cursor()
            insert_query = "INSERT INTO ads (image_url, upload_time) VALUES (%s, %s)"
            current_time = datetime.now()
            cursor.execute(insert_query, (filename, current_time))
            db.commit()
            
            relative_path = os.path.join('uploads', file.filename)
            return jsonify({'message': 'File uploaded successfully!', 'path': relative_path})
            
        except Exception as e:
            db.rollback()
            print("Error uploading file:", e)
            return 'Error uploading file'

def get_image_url():
    try:
        cursor = db.cursor()
        select_query = "SELECT image_url FROM ads"
        cursor.execute(select_query)
        image_urls = [row[0] for row in cursor.fetchall()]
        return jsonify({'image_urls': image_urls})
    
    except Exception as e:
        print("Error fetching image URLs:", e)
        return jsonify({'error': 'Failed to fetch image URLs'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
