from flask import Flask, render_template
import json
from datetime import datetime
app = Flask(__name__)

today = datetime.now()
file_today = f'{today.day}-{today.month}-{today.year}.json'
with open(file_today) as json_file:
    data = json.loads(json_file.read())

@app.route('/')
def index():
    return render_template('index.html', data=data)