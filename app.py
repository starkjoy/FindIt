from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from datetime import datetime

app = Flask(__name__)
cors = CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="FindIt",
    password="Pa$$w0rd!2023",
    database="adboard"
)

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
            return relative_path
            
        except Exception as e:
            db.rollback()
            print("Error uploading file:", e)
            return 'Error uploading file'

@app.route('/get_ads', methods=['GET'])
def get_ads():
    cursor = db.cursor(dictionary=True)
    select_query = "SELECT * FROM ads ORDER BY upload_time DESC"
    cursor.execute(select_query)
    ads = cursor.fetchall()

    for ad in ads:
        ad['image_url'] = os.path.join('uploads', os.path.basename(ad['image_url']))
    return jsonify(ads)

@app.route('/get_uploaded_images', methods=['GET'])
def get_uploaded_images():
    uploaded_images = []

    # Get a list of files in the "static" folder
    static_path = os.path.join(app.root_path, 'static')
    for filename in os.listdir(static_path):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            uploaded_images.append(filename)

    return jsonify(uploaded_images)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
