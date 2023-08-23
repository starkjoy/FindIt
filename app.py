from flask import Flask, render_template, request, jsonify
import mysql.connector
import os
from datetime import datetime

app = Flask(__name__)

db = mysql.connector.connect(
    host="localhost",
    user="FindIt",
    password="Pa$$w0rd!2023",
    database="adboard"
)

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

        cursor = db.cursor()
        insert_query = "INSERT INTO ads (image_url, upload_time) VALUES (%s, %s)"
        current_time = datetime.now()
        cursor.execute(insert_query, (filename, current_time))
        db.commit()
        
        return 'File uploaded successfully'

@app.route('/get_ads', methods=['GET'])
def get_ads():
    cursor = db.cursor(dictionary=True)
    select_query = "SELECT * FROM ads ORDER BY upload_time DESC"
    cursor.execute(select_query)
    ads = cursor.fetchall()
    return jsonify(ads)

if __name__ == '__main__':
    app.run(debug=True)
