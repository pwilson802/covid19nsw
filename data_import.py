import requests
import os
import json
import csv
import urllib.request
import pandas as pd
from collections import Counter
from collections import defaultdict
from datetime import datetime, timedelta

today = datetime.now()
yesterday = datetime.now() - timedelta(days=1)
file_today = f'{today.day}-{today.month}-{today.year}.json'
file_yesterday = f'{yesterday.day}-{yesterday.month}-{yesterday.year}.json'

with open(file_yesterday) as json_file:
    yesterday = json.loads(json_file.read())
yesterday_rank = {x['postcode']: x['rank'] for x in yesterday}
yesterday_count = {x['postcode']: x['count'] for x in yesterday}

csv_file = 'https://data.nsw.gov.au/data/dataset/aefcde60-3b0c-4bc0-9af1-6fe652944ec2/resource/21304414-1ff1-4243-a5d2-f52778048b29/download/covid-19-cases-by-notification-date-and-postcode-local-health-district-and-local-government-area.csv'

covid_frame = pd.read_csv(csv_file)
all_data_list = list(covid_frame['postcode'])
cleaned_list = [int(x) for x in all_data_list if str(x).startswith('2')]

postcodes_count = Counter(cleaned_list)

postcodes_dict = defaultdict(list)
file = open('nsw_postcodes.csv')
csv_file = csv.reader(file)
for line in csv_file:
    postcodes_dict[line[1]].append(line[2].title())

daily_data = []
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
    daily_data[i]['count_change'] = postcodes_count[int(e['postcode'])] - yesterday_count[e['postcode']]

with open(file_today, 'w') as json_file:
    json.dump(daily_data, json_file)
