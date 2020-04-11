import requests
import os
import json
import csv
import urllib.request
import pandas as pd
from collections import Counter
from collections import defaultdict
from datetime import datetime, timedelta

# Details for making the data files used in the website.
# Using environment variables and os.join as development is on Windows and prod is Linux
data_folder = os.environ.get('COVID_DATA')
today = datetime.now()
yesterday = datetime.now() - timedelta(days=1)
file_today_name = f'{today.day}-{today.month}-{today.year}.json'
file_yesterday_name = f'{yesterday.day}-{yesterday.month}-{yesterday.year}.json'
file_today = os.path.join(data_folder,file_today_name)
file_yesterday = os.path.join(data_folder,file_yesterday_name)
postcode_file_today = os.path.join(data_folder,f'postcode-{file_today_name}')
postcode_file_yesterday = os.path.join(data_folder,f'postcode-{file_yesterday_name}')

with open(file_yesterday) as json_file:
    yesterday = json.loads(json_file.read())
yesterday_rank = {x['postcode']: x['rank'] for x in yesterday}
yesterday_count = {x['postcode']: x['count'] for x in yesterday}

csv_file = 'https://data.nsw.gov.au/data/dataset/aefcde60-3b0c-4bc0-9af1-6fe652944ec2/resource/21304414-1ff1-4243-a5d2-f52778048b29/download/covid-19-cases-by-notification-date-and-postcode-local-health-district-and-local-government-area.csv'

covid_frame = pd.read_csv(csv_file)
covid_frame['notification_date'] =  pd.to_datetime(covid_frame['notification_date'])
all_data_list = list(covid_frame['postcode'])
seven_day_list = list(covid_frame[covid_frame['notification_date'] > datetime.now() - timedelta(days=7)]['postcode'])
fourteen_day_list = list(covid_frame[covid_frame['notification_date'] > datetime.now() - timedelta(days=14)]['postcode'])
cleaned_list = [int(x) for x in all_data_list if str(x).startswith('2')]
cleaned_list_seven = [int(x) for x in seven_day_list if str(x).startswith('2')]
cleaned_list_fourteen = [int(x) for x in fourteen_day_list if str(x).startswith('2')]

postcodes_count = Counter(cleaned_list)

postcodes_dict = defaultdict(list)
file = open('nsw_postcodes.csv')
csv_file = csv.reader(file)
for line in csv_file:
    postcodes_dict[line[1]].append(line[2].title())

daily_data = []
daily_data_seven = []
daily_data_fourteen = []

for postcode in postcodes_dict.keys():
    if len(postcode) != 4:
        continue
    temp_dict = {}
    temp_dict['postcode'] = postcode
    temp_dict['count'] = postcodes_count[int(postcode)]
    temp_dict['suburbs'] = ', '.join(postcodes_dict[postcode])
    daily_data.append(temp_dict)

daily_data.sort(key = lambda k: k['count'], reverse=True)

for i, e in enumerate(daily_data):
    rank = i + 1
    current_postcode = e['postcode']
    daily_data[i]['rank'] = rank
    daily_data[i]['previous_rank'] = yesterday_rank[e['postcode']]
    movement = yesterday_rank[e['postcode']] - rank
    if movement > 0:
        movement_rank = f'+{movement}'
    elif movement < 0:
        movement_rank = f'{movement}'
    else:
        movement_rank = '-'
    daily_data[i]['movement_rank'] = movement_rank
    daily_data[i]['previous_count'] = yesterday_count[e['postcode']]
    count_change = postcodes_count[int(e['postcode'])] - yesterday_count[e['postcode']]
    if count_change > 0:
        count_change = f'+{count_change}'
    daily_data[i]['count_change'] = count_change

postcode_dates = covid_frame[['notification_date', 'postcode']]
postcode_dates['notification_date'] =  pd.to_datetime(postcode_dates['notification_date'])
newest_date = postcode_dates['notification_date'].iloc[-1]

day_keys = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen']
postcode_chart = {}
for postcode in postcodes_dict.keys():
    if len(postcode) != 4:
        continue
    postcode_chart[postcode] = {}
    chart_day = newest_date
    # postcode = float(postcode)
    postcode_df = postcode_dates[postcode_dates['postcode']==float(postcode)]
    for num in day_keys:
        date_str = chart_day.strftime('%Y-%m-%d')
        postcode_chart[postcode][str(num)] = {}
        postcode_chart[postcode][str(num)]['year'] = chart_day.year
        # Minus 1 from the month as this will be used in a javascipt graph.  Javascript month indes start from 0 (January).
        postcode_chart[postcode][str(num)]['month'] = chart_day.month - 1
        postcode_chart[postcode][str(num)]['day'] = chart_day.day
        postcode_chart[postcode][str(num)]['daily_count'] = int(postcode_df[postcode_df['notification_date'] == chart_day].count()['postcode'])
        postcode_chart[postcode][str(num)]['total_count'] = int(postcode_df[postcode_df['notification_date'] <= chart_day].count()['postcode'])
        chart_day = chart_day - timedelta(days=1)

with open(file_today, 'w') as json_file:
    json.dump(daily_data, json_file)

with open(postcode_file_today, 'w') as json_file:
    json.dump(postcode_chart, json_file)
