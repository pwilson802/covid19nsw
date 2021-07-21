import os
import json
import csv
import sys
import requests
from time import sleep
from collections import Counter, defaultdict
from datetime_string import make_current_time_string
from datetime import datetime, timedelta
import pandas as pd

data_folder = os.environ.get("COVID_DATA")

main_cases_file = os.path.join(data_folder, 'cases_file_latest.json')

# csv_cases contains all data except recoverd cases
#csv_cases = "https://data.nsw.gov.au/data/dataset/97ea2424-abaf-4f3e-a9f2-b5c883f42b6a/resource/2776dbb8-f807-4fb2-b1ed-184a6fc2c8aa/download/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv"
csv_cases = "https://data.nsw.gov.au/data/dataset/97ea2424-abaf-4f3e-a9f2-b5c883f42b6a/resource/2776dbb8-f807-4fb2-b1ed-184a6fc2c8aa/download/confirmed_cases_table4_location_likely_source.csv"
# csv_test contains all test data
csv_tests = "https://data.nsw.gov.au/data/dataset/60616720-3c60-4c52-b499-751f31e3b132/resource/945c6204-272a-4cad-8e33-dde791f5059a/download/covid-19-tests-by-date-and-postcode-local-health-district-and-local-government-area.csv"
# json_cases contains just cases numbers for the last month with recovered cases
json_cases = "https://nswdac-covid-19-postcode-heatmap.azurewebsites.net/datafiles/data_Cases2.json"
# json_active contains active cases for each postcode for the last 14 days
json_active = "https://nswdac-covid-19-postcode-heatmap.azurewebsites.net/datafiles/active_cases.json"

all_frame = pd.read_csv(csv_cases)
tests_frame = pd.read_csv(csv_tests)
cases_frame = pd.DataFrame(json.loads(requests.get(json_cases).text)['data'])
active_frame = pd.DataFrame(json.loads(requests.get(json_active).text)['data'])

# changing all the dates to datetime format 
all_frame["notification_date"] = pd.to_datetime(all_frame["notification_date"])
tests_frame["test_date"] = pd.to_datetime(tests_frame["test_date"])
cases_frame["Date"] = cases_frame["Date"] + '-21'
cases_frame["Date"] = pd.to_datetime(cases_frame["Date"])

# The dict cases_data will be used for building a json file to be used by the website
# OPening the previous file so only the recent information needs to be updated
if os.path.isfile(main_cases_file):
    update = True
    with open(main_cases_file) as f:
        cases_data = json.loads(f.read())
else:
    update = False
    cases_data = {}
    # Add All Postcodes with suburb and location information to cases_data
    suburb_dict = defaultdict(list)
    file = open("nsw_postcodes.csv")
    csv_file = csv.reader(file)
    for line in csv_file:
        suburb_dict[line[1]].append(line[2].title())
    with open('nsw_postcodes.csv') as file:
        csv_file = csv.reader(file)
        next(csv_file)
        for line in csv_file:
            postcode = line[1]
            cases_data[postcode] = {}
            cases_data[postcode]['suburbs'] = suburb_dict[postcode]
            cases_data[postcode]['map_location'] = [ float(line[5]), float(line[4]) ]
            cases_data[postcode]['postcode'] = postcode
            cases_data[postcode]['history'] = {}
    # Add an all entry to cases_data to be used for All NSW cases
    cases_data['all'] = {'postcode': 'all', 'history': {}}

latest = all_frame['notification_date'].iloc[-1]
oldest = all_frame['notification_date'].iloc[0]
latest_recovered = cases_frame["Date"].iloc[-1]
oldest_recovered = cases_frame["Date"].iloc[0]

def make_time_string(date):
    year = date.year
    month = date.month
    day = date.day
    return f"{year}-{month}-{day}"

def get_case_number(df, date, all="no"):
    # gets the number of cases from the dataframe for the date entered
    # If all = yes return all cases up to the date.
    if all == 'yes':
        return int(df[df["notification_date"] <= date].shape[0])
    return int(df[df["notification_date"] == date].shape[0])

def get_sources(df, date):
    # Gets the sources for a date
    result = {'new': {}, 'total': {}}
    sources = ['Overseas', 'Locally acquired - no links to known case or cluster',
       'Locally acquired - linked to known case or cluster',
       'Interstate', 'Under Investigation']
    for source in sources:
        sources_df = df[df['likely_source_of_infection'] == source]
        result['new'][source.replace(" ", "").replace("-", "").replace("/", "").lower()] = int(sources_df[sources_df["notification_date"] == date].shape[0])
        result['total'][source.replace(" ", "").replace("-", "").replace("/", "").lower()] = int(sources_df[sources_df["notification_date"] <= date].shape[0])
    return result

def get_tests_number(df, date, all="no"):
    # gets the number of tests from the dataframe for the date entered
    # If all = yes return all tests up to the date.
    if all == 'yes':
        return int(df[df["test_date"] <= date].shape[0])
    return int(df[df["test_date"] == date].shape[0])

def get_recovered_number(df, date, all="no"):
    # gets the number of recovered cases from the dataframe for the date entered
    try:
        return int(df[df['Date'] == date].iloc[0]['Recovered'])
    except:
        return 0

def get_cases_back(postcode, days=3):
    cases_today = cases_data[postcode]['history'][make_time_string(latest)]['cases_all']
    prev_date = latest - timedelta(days)
    cases_prev = cases_data[postcode]['history'][make_time_string(prev_date)]['cases_all']
    return cases_today - cases_prev

def get_tests_back(postcode, days):
    tests_today = cases_data[postcode]['history'][make_time_string(latest)]['tests_all']
    prev_date = latest - timedelta(days)
    tests_prev = cases_data[postcode]['history'][make_time_string(prev_date)]['tests_all']
    return tests_today - tests_prev

def get_sources_back(postcode, days):
    sources_today = cases_data[postcode]['history'][make_time_string(latest)]['cases_sources']['total']
    prev_date = latest - timedelta(days)
    sources_prev = cases_data[postcode]['history'][make_time_string(prev_date)]['cases_sources']['total']
    result = {}
    for source in sources_today.keys():
        result[source] = sources_today[source] - sources_prev[source]
    return result
    
def get_active_cases(postcode):
    if postcode == 'all':
        return int(active_frame['Day0'].sum())
    try:
        return int(active_frame[active_frame['POA_NAME16'] == postcode].iloc[0]['Day0'])
    except:
        return 0
    

# Make The big dictionary by each postcode
for postcode in cases_data.keys():
    print(postcode)
    if postcode == 'all':
        postcode_df_all = all_frame
        postcode_df_all_tests = tests_frame
        postcode_df_all_recovered = cases_frame
    else:
        postcode_df_all = all_frame[all_frame["postcode"] == postcode]
        postcode_df_all_tests = tests_frame[tests_frame["postcode"] == postcode]
        postcode_df_all_recovered = cases_frame[cases_frame["POA_NAME16"] == postcode]
    if update == True:
        date = latest - timedelta(5)
    else:
        date = oldest
    recovered = get_recovered_number(postcode_df_all_recovered, oldest_recovered)
    while date <= latest:
        day_string = make_time_string(date)
        cases_data[postcode]['history'][day_string] = {}
        cases_data[postcode]['history'][day_string]['cases_new'] = get_case_number(postcode_df_all, date)
        cases_data[postcode]['history'][day_string]['cases_all'] = get_case_number(postcode_df_all, date, all="yes")
        cases_data[postcode]['history'][day_string]['cases_sources'] = get_sources(postcode_df_all, date)
        cases_data[postcode]['history'][day_string]['tests_new'] = get_tests_number(postcode_df_all_tests, date)
        cases_data[postcode]['history'][day_string]['tests_all'] = get_tests_number(postcode_df_all_tests, date, all="yes")
        if (date <= latest_recovered) and (date >= oldest_recovered):
            # recovered only go back 14 days so only look when the dates are available
            all_recovered = get_recovered_number(postcode_df_all_recovered, date, all="yes")
            cases_data[postcode]['history'][day_string]['recovered_all'] = all_recovered
            cases_data[postcode]['history'][day_string]['recovered_new'] = int(all_recovered) - int(recovered)
            recovered = all_recovered
        date = date + timedelta(days=1)
    cases_data[postcode]['cases_recovered'] = recovered
    cases_data[postcode]['cases_recent'] = get_cases_back(postcode)
    cases_data[postcode]['cases_active'] = get_active_cases(postcode)
    cases_data[postcode]['all_days'] = {}
    cases_data[postcode]['fourteen_days'] = {}
    cases_data[postcode]['seven_days'] = {}
    cases_data[postcode]['all_days']['cases'] = cases_data[postcode]['history'][make_time_string(latest)]['cases_all']
    cases_data[postcode]['all_days']['tests'] = cases_data[postcode]['history'][make_time_string(latest)]['tests_all']
    cases_data[postcode]['all_days']['source'] = cases_data[postcode]['history'][make_time_string(latest)]['cases_sources']['total']
    cases_data[postcode]['seven_days']['cases'] = get_cases_back(postcode, days=7)
    cases_data[postcode]['seven_days']['tests'] = get_tests_back(postcode, days=7)
    cases_data[postcode]['seven_days']['source'] = get_sources_back(postcode, days=7)
    cases_data[postcode]['fourteen_days']['cases'] = get_cases_back(postcode, days=14)
    cases_data[postcode]['fourteen_days']['tests'] = get_tests_back(postcode, days=14)
    cases_data[postcode]['fourteen_days']['source'] = get_sources_back(postcode, days=14)
    sleep(0.5)


# create a dictionary for mapping suburb to postcode
### Commenting this out as it takes too long and the file doesn't change
### START
# suburbs = [x for x in [cases_data[x]['suburbs'] for x in cases_data.keys() if x != 'all']]
# all_suburbs = [item.strip() for l in suburbs for item in l]
# suburb_postcode_dict = {}
# for suburb in all_suburbs:
#     # for postcode in list(postcodes_dict.keys())[1:]:
#     for postcode in [x for x in cases_data.keys() if x != 'all']:
#         print(postcode)
#         if suburb in cases_data[postcode]['suburbs']:
#             suburb_postcode_dict[suburb.lower()] = postcode
### END
#############

#Adding a location to all so dictionary comprehension is easy
cases_data['all']['map_location'] = cases_data['2016']['map_location']
# Make a smaller file to be used by maps and initial tables for faster load times
high_level_data = {x: {'active_cases': cases_data[x]['cases_active'],
                       'recovered_cases': cases_data[x]['cases_recovered'],
                       'map_location': cases_data[x]['map_location'],
                       'all_days': cases_data[x]['all_days']['cases'],
                       'seven_days': cases_data[x]['seven_days']['cases'],
                       'fourteen_days': cases_data[x]['fourteen_days']['cases']
                       } for x in cases_data}

with open(main_cases_file, "w") as json_file:
    json.dump(cases_data, json_file)

high_level_data_file = os.path.join(data_folder, 'high_level_data.json')
with open(high_level_data_file, "w") as json_file:
    json.dump(high_level_data, json_file)