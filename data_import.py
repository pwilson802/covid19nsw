import requests
import os
import json
import csv
import urllib.request
import pandas as pd
from collections import Counter, defaultdict
from datetime import datetime, timedelta

# Details for making the data files used in the website.
# Using environment variables and os.join as development is on Windows and prod is Linux
# This could probably o into a database at some point but josn files are fast
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
cleaned_list_all = [int(x) for x in all_data_list if str(x).startswith('2')]
cleaned_list_seven = [int(x) for x in seven_day_list if str(x).startswith('2')]
cleaned_list_fourteen = [int(x) for x in fourteen_day_list if str(x).startswith('2')]

postcodes_dict = defaultdict(list)
file = open('nsw_postcodes.csv')
csv_file = csv.reader(file)
for line in csv_file:
    postcodes_dict[line[1]].append(line[2].title())

# Getting the rank information for each postcode
# need to add multiople days
def get_postcode_rank(cleaned_list, days=all):
    postcodes_count = Counter(cleaned_list)
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
        count_change = postcodes_count[int(e['postcode'])] - yesterday_count[e['postcode']]
        if count_change > 0:
            count_change = f'+{count_change}'
        daily_data[i]['count_change'] = count_change
    return daily_data

all_data = get_postcode_rank(cleaned_list_all)
seven_day_data = get_postcode_rank(cleaned_list_seven)
fourteen_day_data = get_postcode_rank(cleaned_list_fourteen)


# Get the details for making the charts for each postcode
#
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

# create a dictionary for mapping suburb to postcode
suburbs = list(postcodes_dict.values())[1:]
all_suburbs = [item for l in suburbs for item in l]
suburb_postcode_dict = {}
for suburb in all_suburbs:
    for postcode in list(postcodes_dict.keys())[1:]:
        if suburb in postcodes_dict[postcode]:
            suburb_postcode_dict[suburb] = postcode

# Create a list of all suburbs and postcodes for error checkinf
all_suburbs_postcodes = list(postcodes_dict.keys())[1:] + all_suburbs

# Write all the json files
with open(file_today, 'w') as json_file:
    json.dump(all_data, json_file)

with open(seven_file_today, 'w') as json_file:
    json.dump(seven_day_data, json_file)

with open(fourteen_file_today, 'w') as json_file:
    json.dump(fourteen_day_data, json_file)

with open(postcode_file_today, 'w') as json_file:
    json.dump(postcode_chart, json_file)


with open(suburb_to_postcode_file, 'w') as json_file:
    json.dump(suburb_postcode_dict, json_file)

with open(all_postcode_suburb_file, 'w') as json_file:
    json.dump(all_suburbs_postcodes, json_file)

