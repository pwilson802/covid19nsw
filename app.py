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
seven_file_today = os.path.join(data_folder,f'seven-{file_today_name}')
seven_file_yesterday = os.path.join(data_folder,f'seven-{file_yesterday_name}')
fourteen_file_today = os.path.join(data_folder,f'fourteen-{file_today_name}')
fourteen_file_yesterday = os.path.join(data_folder,f'fourteen-{file_yesterday}')
suburb_to_postcode_file = os.path.join(data_folder,'suburb_to_postcode.json')
all_postcode_suburb_file = os.path.join(data_folder,'all_postcode_suburb.json')


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

# If todays seven day data file hasn't been loaded yet, we will grab yesterdays file
if os.path.isfile(seven_file_today):
    with open(seven_file_today) as json_file:
        data_seven_days = json.loads(json_file.read())
else:
    with open(seven_file_yesterday) as json_file:
        data_seven_days = json.loads(json_file.read())

# If todays fourteen day data file hasn't been loaded yet, we will grab yesterdays file
if os.path.isfile(fourteen_file_today):
    with open(fourteen_file_today) as json_file:
        data_fourteen_days = json.loads(json_file.read())
else:
    with open(fourteen_file_yesterday) as json_file:
        data_fourteen_days = json.loads(json_file.read())

# Load the extra suburb and postcode data
with open(suburb_to_postcode_file) as json_file:
        suburb_to_postcode_dict = json.loads(json_file.read())
with open(all_postcode_suburb_file) as json_file:
        all_postcode_suburb_list = json.loads(json_file.read())


@app.route('/', methods = ['POST', 'GET'])
def index():
    if request.method == 'POST':
        input_data = request.form
        days = input_data['days']
        if days == 'seven':
            return render_template('index.html', data=data_seven_days, days_set='seven')
        if days == 'fourteen':
            return render_template('index.html', data=data_fourteen_days, days_set='fourteen')
    return render_template('index.html', data=data, days_set = 'all' )

@app.route('/postcode',methods = ['POST', 'GET'])
def postcode():
    if request.method == 'POST':
        input_data = request.form
        try:
            days = input_data['days']
            print("------------------------")
            print(days)
            if 'recall' in days:
                _, postcode, days = days.split('-')
        except:
            days = 'all'
            postcode = input_data['postcode']
        if postcode not in all_postcodes:
            return render_template('postcode_error.html', postcode = postcode)
        close_postcodes_try = [int(postcode) - 1, int(postcode) - 2, int(postcode) + 1, int(postcode) + 2]
        close_postcodes = [str(x) for x in close_postcodes_try if str(x) in all_postcodes]
        if days == 'seven':
            postcode_data = [x for x in data_seven_days if x['postcode'] == postcode]
            close_postcode_data = [x for x in data_seven_days if x['postcode'] in close_postcodes]
            return render_template("postcode.html",postcode = postcode, data = postcode_data, history=postcode_history[postcode],days_set = 'seven', close = close_postcode_data)
        elif days == 'fourteen':
            postcode_data = [x for x in data_fourteen_days if x['postcode'] == postcode]
            close_postcode_data = [x for x in data_fourteen_days if x['postcode'] in close_postcodes]
            return render_template("postcode.html",postcode = postcode, data = postcode_data, history=postcode_history[postcode],days_set = 'fourteen', close = close_postcode_data )
        else:
            postcode_data = [x for x in data if x['postcode'] == postcode]
            close_postcode_data = [x for x in data if x['postcode'] in close_postcodes]
            return render_template("postcode.html",postcode = postcode, data = postcode_data, history=postcode_history[postcode],days_set = 'all', close = close_postcode_data)
    else:
        return render_template('index.html', data=data)