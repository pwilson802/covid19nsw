from flask import Flask, render_template, request
import json
from datetime import datetime, timedelta
import os.path
from difflib import get_close_matches

from maps import popup_html, all_map, remove_bootstrap3, random_map_name

app = Flask(__name__)

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
last_update_file = os.path.join(data_folder, "last_update_time")
case_count_file = os.path.join(data_folder, "case_count.json")
map_data_file = os.path.join(data_folder, "map_data.json")

# get the last update time for display on th website postcode page
with open(last_update_file) as f:
    last_update = f.readlines()[0]

# If todays file hasn't been loaded yet, we will grab yesterdays file
if os.path.isfile(file_today):
    with open(file_today) as json_file:
        data = json.loads(json_file.read())
else:
    with open(file_yesterday) as json_file:
        data = json.loads(json_file.read())

all_postcodes = [x["postcode"] for x in data]

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

with open(case_count_file) as json_file:
    case_count = json.loads(json_file.read())

validation_list = [x.lower() for x in all_postcode_suburb_list]
all_postcode_suburb_list = set(all_postcode_suburb_list)

data_shown = [x for x in data if x["count"] != 0]
seven_day_data_shown = [x for x in data_seven_days if x["count"] != 0]
fourteen_day_data_shown = [x for x in data_fourteen_days if x["count"] != 0]

# Generate Maps
# all_data_maps = all_map()


@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "POST":
        input_data = request.form
        days = input_data["days"]
        print('root page post request')
        print(days)
        if days == "seven":
            return render_template(
                "index.html",
                data=seven_day_data_shown,
                days_set="seven",
                validation_set=all_postcode_suburb_list,
                case_numbers = case_count['seven'],
            )
        if days == "fourteen":
            return render_template(
                "index.html",
                data=fourteen_day_data_shown,
                days_set="fourteen",
                validation_set=all_postcode_suburb_list,
                case_numbers = case_count['fourteen'],
            )
    return render_template(
        "index.html",
        data=data_shown,
        days_set="all",
        validation_set=all_postcode_suburb_list,
        case_numbers = case_count['all'],
    )


@app.route("/postcode", methods=["POST", "GET"])
def postcode():
    print("-----------")
    if request.method == "POST":
        input_data = request.form
        try:
            days = input_data["days"]
            if "recall" in days:
                _, postcode, days = days.split("-")
        except:
            days = "all"
            postcode = input_data["postcode"]
        try:
            source = input_data['source']
            days = input_data['days']
            postcode = input_data["postcode"]
        except:
            source = 'list_view'
        print(source)
        if postcode.lower() not in validation_list:
            close_options = get_close_matches(postcode.lower(), validation_list)
            in_options = [x for x in validation_list if postcode in x]
            all_options = [x.title() for x in set(in_options + close_options)]
            if len(all_options) == 0:
                other_options = "no"
            else:
                other_options = "yes"
            if source == 'maps':
                return render_template(
                    "postcode_error.html",
                    postcode=postcode.title(),
                    other_options=other_options,
                    all_options=all_options,
                    validation_set=all_postcode_suburb_list,
                    view_mode="map"
                )
            else:
                return render_template(
                    "postcode_error.html",
                    postcode=postcode.title(),
                    other_options=other_options,
                    all_options=all_options,
                    validation_set=all_postcode_suburb_list,
                )
        # Need to find if the search is not a post code so we can convert it
        if not postcode.startswith("2"):
            postcode = suburb_to_postcode_dict[postcode.lower()]
        close_postcodes_try = [
            int(postcode) - 1,
            int(postcode) - 2,
            int(postcode) + 1,
            int(postcode) + 2,
        ]
        close_postcodes = [
            str(x) for x in close_postcodes_try if str(x) in all_postcodes
        ]
        if days == "seven":
            if source == 'maps':
                temp_map_name = random_map_name()
                map_data = all_map('seven_day_count', postcode_zoom=postcode,zoom=13)
                map_data.save(temp_map_name)
                remove_bootstrap3(temp_map_name)
                just_the_file = os.path.split(temp_map_name)[-1]
                map_template = f"temp_maps/{just_the_file}"
                return render_template('map_direct.html', days_set="seven", view_mode="map", temp_map_name=map_template, temp_map = 'true')
            postcode_data = [x for x in data_seven_days if x["postcode"] == postcode]
            close_postcode_data = [
                x for x in data_seven_days if x["postcode"] in close_postcodes
            ]
            return render_template(
                "postcode.html",
                postcode=postcode,
                data=postcode_data,
                history=postcode_history[postcode],
                days_set="seven",
                close=close_postcode_data,
                validation_set=all_postcode_suburb_list,
                last_update = last_update,
            )
        elif days == "fourteen":
            if source == 'maps':
                temp_map_name = random_map_name()
                map_data = all_map('fourteen_day_count', postcode_zoom=postcode,zoom=13)
                map_data.save(temp_map_name)
                remove_bootstrap3(temp_map_name)
                just_the_file = os.path.split(temp_map_name)[-1]
                map_template = f"temp_maps/{just_the_file}"
                return render_template('map_direct.html', days_set="fourteen", view_mode="map", temp_map_name=map_template, temp_map = 'true')
            postcode_data = [x for x in data_fourteen_days if x["postcode"] == postcode]
            close_postcode_data = [
                x for x in data_fourteen_days if x["postcode"] in close_postcodes
            ]
            return render_template(
                "postcode.html",
                postcode=postcode,
                data=postcode_data,
                history=postcode_history[postcode],
                days_set="fourteen",
                close=close_postcode_data,
                validation_set=all_postcode_suburb_list,
                last_update = last_update,
            )
        else:
            if source == 'maps':
                temp_map_name = random_map_name()
                map_data = all_map('all_count', postcode_zoom=postcode,zoom=13)
                map_data.save(temp_map_name)
                remove_bootstrap3(temp_map_name)
                just_the_file = os.path.split(temp_map_name)[-1]
                map_template = f"temp_maps/{just_the_file}"
                return render_template('map_direct.html', days_set="all", view_mode="map", temp_map_name=map_template, temp_map = 'true')
            postcode_data = [x for x in data if x["postcode"] == postcode]
            close_postcode_data = [x for x in data if x["postcode"] in close_postcodes]
            return render_template(
                "postcode.html",
                postcode=postcode,
                data=postcode_data,
                history=postcode_history[postcode],
                days_set="all",
                close=close_postcode_data,
                validation_set=all_postcode_suburb_list,
                last_update = last_update,
            )
    else:
        print(request.args["location"])
        postcode = request.args["location"]
        if not postcode.startswith("2"):
            postcode = suburb_to_postcode_dict[postcode.lower()]
        close_postcodes_try = [
            int(postcode) - 1,
            int(postcode) - 2,
            int(postcode) + 1,
            int(postcode) + 2,
        ]
        close_postcodes = [
            str(x) for x in close_postcodes_try if str(x) in all_postcodes
        ]
        postcode_data = [x for x in data if x["postcode"] == postcode]
        close_postcode_data = [x for x in data if x["postcode"] in close_postcodes]
        return render_template(
            "postcode.html",
            postcode=postcode,
            data=postcode_data,
            history=postcode_history[postcode],
            days_set="all",
            close=close_postcode_data,
            validation_set=all_postcode_suburb_list,
            last_update = last_update,
        )

@app.route('/sitemap.xml')
def site_map():
    return render_template('sitemap.xml')

@app.route('/map', methods=["POST", "GET"])
def map():
    if request.method == "POST":
        input_data = request.form
        days = input_data["days"]
        if days == "seven":
            return render_template('map_direct.html', days_set="seven", view_mode="map",temp_map='false')
        if days == "fourteen":
            return render_template('map_direct.html', days_set="fourteen", view_mode="map",temp_map='false')
        else:
            return render_template('map_direct.html', days_set="all", view_mode="map",temp_map='false')
    else:
        return render_template('map_direct.html', days_set="all", view_mode="map",temp_map='false')



# @app.route('/map')
# def map():
#     return render_template('main_map.html')

# @app.route('/all_map_page')
# def all_map_page():
#     return render_template('all_map.html')

# @app.route('/direct_map')
# def direct_map():
#     return render_template('map_direct.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0")
