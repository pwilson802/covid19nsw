from flask import Flask, render_template
import json
from datetime import datetime, timedelta
import os.path
app = Flask(__name__)

today = datetime.now()
yesterday = datetime.now() - timedelta(days=1)
file_today = f'{today.day}-{today.month}-{today.year}.json'
file_yesterday = f'{yesterday.day}-{yesterday.month}-{yesterday.year}.json'


if os.path.isfile(file_today):
    with open(file_today) as json_file:
        data = json.loads(json_file.read())
else:
    with open(file_yesterday) as json_file:
        data = json.loads(json_file.read())

@app.route('/')
def index():
    return render_template('index.html', data=data)