from flask import Flask, render_template, request
import json
from datetime import datetime, timedelta
import os.path
app = Flask(__name__)

data_folder = os.environ.get('COVID_DATA')

today = datetime.now()
yesterday = datetime.now() - timedelta(days=1)
file_today_name = f'{today.day}-{today.month}-{today.year}.json'
file_yesterday_name = f'{yesterday.day}-{yesterday.month}-{yesterday.year}.json'
file_today = os.path.join(data_folder,file_today_name)
file_yesterday = os.path.join(data_folder,file_yesterday_name)
postcode_file_today = os.path.join(data_folder,f'postcode-{file_today_name}')
postcode_file_yesterday = os.path.join(data_folder,f'postcode-{file_yesterday_name}')


# If todays file hasn't been loaded yet, we will grab yesterdays file
if os.path.isfile(file_today):
    with open(file_today) as json_file:
        data = json.loads(json_file.read())
else:
    with open(file_yesterday) as json_file:
        data = json.loads(json_file.read())

all_postcodes = [x['postcode'] for x in data]

# If todays postcode file hasn't been loaded yet, we will grab yesterdays file
if os.path.isfile(postcode_file_today):
    with open(postcode_file_today) as json_file:
        postcode_history = json.loads(json_file.read())
else:
    with open(postcode_file_yesterday) as json_file:
        postcode_history = json.loads(json_file.read())


@app.route('/')
def index():
    return render_template('index.html', data=data)

@app.route('/postcode',methods = ['POST', 'GET'])
def postcode():
    if request.method == 'POST':
        input_data = request.form
        postcode = input_data['postcode']
        if postcode not in all_postcodes:
            return render_template('postcode_error.html', postcode = postcode)
        postcode_data = [x for x in data if x['postcode'] == postcode]
        return render_template("postcode.html",data = postcode_data, history=postcode_history[postcode])
    else:
        return render_template('index.html', data=data)