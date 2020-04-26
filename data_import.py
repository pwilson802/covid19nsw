import os
import json
import csv
import sys
from datetime_string import make_current_time_string
import pandas as pd
from collections import Counter, defaultdict
from datetime import datetime, timedelta

# Details for making the data files used in the website.
# Using environment variables and os.join as development is on Windows and prod is Linux
# This could probably o into a database at some point but josn files are fast and work for the moment
data_folder = os.environ.get("COVID_DATA")
today = datetime.now()
yesterday = datetime.now() - timedelta(days=1)
file_today_name = f"{today.day}-{today.month}-{today.year}.json"
file_yesterday_name = f"{yesterday.day}-{yesterday.month}-{yesterday.year}.json"
file_today = os.path.join(data_folder, file_today_name)
file_yesterday = os.path.join(data_folder, file_yesterday_name)
postcode_file_today = os.path.join(data_folder, f"postcode-{file_today_name}")
postcode_file_yesterday = os.path.join(data_folder, f"postcode-{file_yesterday_name}")
seven_file_today = os.path.join(data_folder, f"seven-{file_today_name}")
seven_file_yesterday = os.path.join(data_folder, f"seven-{file_yesterday_name}")
fourteen_file_today = os.path.join(data_folder, f"fourteen-{file_today_name}")
fourteen_file_yesterday = os.path.join(data_folder, f"fourteen-{file_yesterday_name}")
suburb_to_postcode_file = os.path.join(data_folder, "suburb_to_postcode.json")
all_postcode_suburb_file = os.path.join(data_folder, "all_postcode_suburb.json")
case_count_file = os.path.join(data_folder, "case_count.json")
map_data_file = os.path.join(data_folder, "map_data.json")
testing_chart_file = os.path.join(data_folder, "testing_chart.json")

with open(file_yesterday) as json_file:
    yesterday = json.loads(json_file.read())
with open(seven_file_yesterday) as json_file:
    seven_yesterday = json.loads(json_file.read())
with open(fourteen_file_yesterday) as json_file:
    fourteen_yesterday = json.loads(json_file.read())

yesterday_rank = {x["postcode"]: x["rank"] for x in yesterday}
yesterday_count = {x["postcode"]: x["count"] for x in yesterday}
seven_yesterday_rank = {x["postcode"]: x["rank"] for x in seven_yesterday}
seven_yesterday_count = {x["postcode"]: x["count"] for x in seven_yesterday}
fourteen_yesterday_rank = {x["postcode"]: x["rank"] for x in fourteen_yesterday}
fourteen_yesterday_count = {x["postcode"]: x["count"] for x in fourteen_yesterday}

csv_file = "https://data.nsw.gov.au/data/dataset/97ea2424-abaf-4f3e-a9f2-b5c883f42b6a/resource/2776dbb8-f807-4fb2-b1ed-184a6fc2c8aa/download/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv"

covid_frame = pd.read_csv(csv_file)


covid_frame["notification_date"] = pd.to_datetime(covid_frame["notification_date"])
all_data_list = list(covid_frame["postcode"])
seven_day_list = list(
    covid_frame[covid_frame["notification_date"] > datetime.now() - timedelta(days=7)][
        "postcode"
    ]
)
fourteen_day_list = list(
    covid_frame[covid_frame["notification_date"] > datetime.now() - timedelta(days=14)][
        "postcode"
    ]
)
recent_list = list(
    covid_frame[covid_frame["notification_date"] > datetime.now() - timedelta(days=4)][
        "postcode"
    ]
)

case_count = {
    'all': len(all_data_list),
    'seven': len(seven_day_list),
    'fourteen': len(fourteen_day_list)
}

cleaned_list_all = [int(x) for x in all_data_list if str(x).startswith("2")]
cleaned_list_seven = [int(x) for x in seven_day_list if str(x).startswith("2")]
cleaned_list_fourteen = [int(x) for x in fourteen_day_list if str(x).startswith("2")]
recent_list_cleaned = [str(int(x)) for x in recent_list if str(x).startswith("2")]
########################################CHANGE###################################
##################################################################################
####################################################################################
suburb_dict = defaultdict(list)
file = open("nsw_postcodes.csv")
csv_file = csv.reader(file)
for line in csv_file:
    suburb_dict[line[1]].append(line[2].title())

postcode_dict = {}
with open('nsw_postcodes.csv') as file:
    csv_file = csv.reader(file)
    next(csv_file)
    for line in csv_file:
        postcode = line[1]
        postcode_dict[postcode] = {}
        postcode_dict[postcode]['suburbs'] = suburb_dict[postcode]
        postcode_dict[postcode]['map_location'] = [ float(line[5]), float(line[4]) ]
        postcode_dict[postcode]['postcode'] = postcode




# Creating a dictionary of each postcode withe relevant information and adding them to a list
def get_postcode_rank(cleaned_list, days_back=365):
    postcodes_count = Counter(cleaned_list)
    daily_data = []

    for postcode in postcode_dict.keys():
        if len(postcode) != 4:
            continue
        temp_dict = {}
        temp_dict["postcode"] = postcode
        temp_dict["count"] = postcodes_count[int(postcode)]
        temp_dict["suburbs"] = ", ".join(postcode_dict[postcode]['suburbs'])
        daily_data.append(temp_dict)

    daily_data.sort(key=lambda k: k["count"], reverse=True)
    if days_back == 7:
        previous_rank = seven_yesterday_rank
        previous_count = seven_yesterday_count
    elif days_back == 14:
        previous_rank = fourteen_yesterday_rank
        previous_count = fourteen_yesterday_count
    else:
        previous_rank = yesterday_rank
        previous_count = yesterday_count
    for i, e in enumerate(daily_data):
        rank = i + 1
        current_postcode = e["postcode"]
        daily_data[i]["rank"] = rank
        daily_data[i]["previous_rank"] = previous_rank[e["postcode"]]
        movement = previous_rank[e["postcode"]] - rank
        if movement > 0:
            movement_rank = f"+{movement}"
        elif movement < 0:
            movement_rank = f"{movement}"
        else:
            movement_rank = "-"
        daily_data[i]["movement_rank"] = movement_rank
        daily_data[i]["previous_count"] = previous_count[e["postcode"]]
        count_change = recent_list_cleaned.count(current_postcode)
        daily_data[i]["count_change"] = count_change
        daily_data[i]["source"] = {}
        for s in covid_frame["likely_source_of_infection"].unique():
            daily_data[i]["source"][
                s.replace(" ", "").replace("-", "").replace("/", "").lower()
            ] = covid_frame.loc[
                (
                    covid_frame["notification_date"]
                    > datetime.now() - timedelta(days=days_back)
                )
                & (covid_frame["postcode"] == int(current_postcode))
                & (covid_frame["likely_source_of_infection"] == s)
            ].shape[
                0
            ]
    return daily_data


all_data = get_postcode_rank(cleaned_list_all)
seven_day_data = get_postcode_rank(cleaned_list_seven, days_back=7)
fourteen_day_data = get_postcode_rank(cleaned_list_fourteen, days_back=14)

for line in all_data:
    # postcode_dict[line['postcode']]['postcode'] = postcode
    postcode_dict[line['postcode']]['all_count'] = line['count']
    postcode_dict[line['postcode']]['all_rank'] = line['rank']
    postcode_dict[line['postcode']]['suburbs'] = line['suburbs']
for line in seven_day_data:
    postcode_dict[line['postcode']]['seven_day_count'] = line['count']
    postcode_dict[line['postcode']]['seven_day_rank'] = line['rank']
for line in fourteen_day_data:
    postcode_dict[line['postcode']]['fourteen_day_count'] = line['count']
    postcode_dict[line['postcode']]['fourteen_day_rank'] = line['rank']


# Get the details for making the charts for each postcode
postcode_dates = covid_frame[["notification_date", "postcode"]]
postcode_dates["notification_date"] = pd.to_datetime(
    postcode_dates["notification_date"]
)
newest_date = postcode_dates["notification_date"].iloc[-1]

postcode_chart = {}
for postcode in postcode_dict.keys():
    if len(postcode) != 4:
        continue
    # postcode_chart[postcode] = {}
    chart_rows = []
    chart_day = newest_date
    # postcode = float(postcode)
    postcode_df = postcode_dates[postcode_dates["postcode"] == float(postcode)]
    for num in range(30):
        date_str = chart_day.strftime("%Y-%m-%d")
        year = chart_day.year
        month = chart_day.month - 1
        day = chart_day.day
        daily_count = int(
            postcode_df[postcode_df["notification_date"] == chart_day].count()[
                "postcode"
            ]
        )
        total_count = int(
            postcode_df[postcode_df["notification_date"] <= chart_day].count()[
                "postcode"
            ]
        )
        row_entry = f"[new Date({year},{month},{day}), {total_count}],"
        chart_rows.append(row_entry)
        chart_day = chart_day - timedelta(days=1)
    postcode_chart[postcode] = chart_rows

# Get the details for making a chart for the test cases to be displayed on each postcode page
test_csv_file = "https://data.nsw.gov.au/data/dataset/5424aa3b-550d-4637-ae50-7f458ce327f4/resource/227f6b65-025c-482c-9f22-a25cf1b8594f/download/covid-19-tests-by-date-and-location-and-result.csv"

covid_test_frame = pd.read_csv(test_csv_file)

covid_test_frame["test_date"] = pd.to_datetime(
    covid_test_frame["test_date"]
)

newest_date = covid_test_frame["test_date"].iloc[-1]

testing_chart = {}
for postcode in postcode_dict.keys():
    if len(postcode) != 4:
        continue
    # postcode_chart[postcode] = {}
    chart_rows = []
    chart_day = newest_date
    # postcode = float(postcode)
    postcode_df = covid_test_frame[covid_test_frame["postcode"] == float(postcode)]
    for num in range(45):
        # date_str = chart_day.strftime("%Y-%m-%d")
        year = chart_day.year
        month = chart_day.month - 1
        day = chart_day.day
        daily_tests = int(
            postcode_df[postcode_df["test_date"] == chart_day].count()[
                "postcode"
            ]
        )
        daily_positive = int(
            postcode_df[postcode_df["test_date"] == chart_day][postcode_df["result"] == "Case - Confirmed"].count()[
                "postcode"
            ]
        )
        row_entry = f"[new Date({year},{month},{day}), {daily_tests}, {daily_positive}],"
        chart_rows.append(row_entry)
        chart_day = chart_day - timedelta(days=1)
    testing_chart[postcode] = chart_rows


# create a dictionary for mapping suburb to postcode
# suburbs = list(postcodes_dict.values())[1:]
# all_suburbs = [item for l in suburbs for item in l]
suburbs = [x.split(',') for x in [postcode_dict[x]['suburbs'] for x in postcode_dict.keys()]]
all_suburbs = [item.strip() for l in suburbs for item in l]
suburb_postcode_dict = {}
for suburb in all_suburbs:
    # for postcode in list(postcodes_dict.keys())[1:]:
    for postcode in list(postcode_dict.keys()):
        if suburb in postcode_dict[postcode]['suburbs']:
            suburb_postcode_dict[suburb.lower()] = postcode

# Create a list of all suburbs and postcodes for error checkinf
all_suburbs_postcodes = list(postcode_dict.keys()) + all_suburbs


# Add Data for All of NSW to the export files
# Data for numbers display of NSW All Page
postcode_dict['all_nsw'] = {}
postcode_dict['all_nsw']['all_count'] = case_count['all']
postcode_dict['all_nsw']['seven_day_count'] = case_count['seven']
postcode_dict['all_nsw']['fourteen_day_count'] = case_count['fourteen']
postcode_dict['all_nsw']['recent'] = len(recent_list)

# Data for the Al NSW cases count chart
all_nsw_chart_cases = []
chart_day = newest_date
for num in range(90):
    # date_str = chart_day.strftime("%Y-%m-%d")
    year = chart_day.year
    month = chart_day.month - 1
    day = chart_day.day
    daily_count = int(
            postcode_dates[postcode_dates["notification_date"] == chart_day].count()[
                "postcode"
            ]
        )
    total_count = int(
            postcode_dates[postcode_dates["notification_date"] <= chart_day].count()[
                "postcode"
            ]
        )
    row_entry = f"[new Date({year},{month},{day}), {total_count}],"
    all_nsw_chart_cases.append(row_entry)
    chart_day = chart_day - timedelta(days=1)
postcode_chart['all_nsw'] = all_nsw_chart_cases


# Make the testing chart for all NSW
chart_day = newest_date
all_nsw_chart_tests = []
for num in range(90):
    # date_str = chart_day.strftime("%Y-%m-%d")
    year = chart_day.year
    month = chart_day.month - 1
    day = chart_day.day
    # date_str = chart_day.strftime("%Y-%m-%d")
    year = chart_day.year
    month = chart_day.month - 1
    day = chart_day.day
    daily_tests = int(
        covid_test_frame[covid_test_frame["test_date"] == chart_day].count()[
            "postcode"
        ]
    )
    daily_positive = int(
        covid_test_frame[covid_test_frame["test_date"] == chart_day][covid_test_frame["result"] == "Case - Confirmed"].count()[
            "postcode"
        ]
    )
    row_entry = f"[new Date({year},{month},{day}), {daily_tests}, {daily_positive}],"
    all_nsw_chart_tests.append(row_entry)
    chart_day = chart_day - timedelta(days=1)
    print(chart_day)

testing_chart['all_nsw'] = all_nsw_chart_tests

# Get the infection source for all NSW
nsw_source = {'all': {}, 'fourteen': {}, 'seven': {} }
for days in ['all', 'fourteen', 'seven']:
    if days == 'seven':
        days_back = 7
    if days == 'fourteen':
        days_back = 14
    if days == 'all':
        days_back = 365
    for s in covid_frame["likely_source_of_infection"].unique():
        nsw_source[days][
            s.replace(" ", "").replace("-", "").replace("/", "").lower()
        ] = covid_frame.loc[
            (
                covid_frame["notification_date"]
                > datetime.now() - timedelta(days=days_back)
            )
            & (covid_frame["likely_source_of_infection"] == s)
        ].shape[
            0
        ]

postcode_dict['all_nsw']['source'] = nsw_source
    
    


# Write all the json files
with open(file_today, "w") as json_file:
    json.dump(all_data, json_file)

with open(seven_file_today, "w") as json_file:
    json.dump(seven_day_data, json_file)

with open(fourteen_file_today, "w") as json_file:
    json.dump(fourteen_day_data, json_file)

with open(postcode_file_today, "w") as json_file:
    json.dump(postcode_chart, json_file)

with open(suburb_to_postcode_file, "w") as json_file:
    json.dump(suburb_postcode_dict, json_file)

with open(all_postcode_suburb_file, "w") as json_file:
    json.dump(all_suburbs_postcodes, json_file)

with open(case_count_file, "w") as json_file:
    json.dump(case_count, json_file)

with open(map_data_file, "w") as json_file:
    json.dump(postcode_dict, json_file)

with open(testing_chart_file, "w") as json_file:
    json.dump(testing_chart, json_file)