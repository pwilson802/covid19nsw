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
suburb_to_postcode_file = os.path.join(data_folder, "suburb_to_postcode.json")
all_postcode_suburb_file = os.path.join(data_folder, "all_postcode_suburb.json")
last_update_file = os.path.join(data_folder, "last_update_time")
case_count_file = os.path.join(data_folder, "case_count.json")
map_data_file = os.path.join(data_folder, "map_data.json")

# New Import file
main_cases_file = os.path.join(data_folder, 'cases_file_latest.json')
with open(main_cases_file) as f:
    cases_data = json.loads(f.read())

#Adding a location and suburbs to all so dictionary comprehension is easy
cases_data['all']['map_location'] = cases_data['2016']['map_location']
cases_data['all']['suburbs'] = "none"
# Make a smaller file to be used by maps and initial tables for faster load times

def get_high_level(cases):
    result = {x: {'active_cases': cases[x]['cases_active'],
                       'recovered_cases': cases[x]['cases_recovered'],
                       'map_location': cases[x]['map_location'],
                       'all_days': cases[x]['all_days']['cases'],
                       'seven_days': cases[x]['seven_days']['cases'],
                       'fourteen_days': cases[x]['fourteen_days']['cases'],
                       'suburbs': cases[x]['suburbs'],
                       'cases_recent': cases[x]['cases_recent'],
                       } for x in cases}
    return result

high_level_data = get_high_level(cases_data)


# get the last update time for display on th website postcode page
with open(last_update_file) as f:
    last_update = f.readlines()[0]

all_postcodes = [x for x in cases_data.keys() if not x.startswith('a')]

# Load the extra suburb and postcode data
with open(suburb_to_postcode_file) as json_file:
    suburb_to_postcode_dict = json.loads(json_file.read())
with open(all_postcode_suburb_file) as json_file:
    all_postcode_suburb_list = json.loads(json_file.read())

with open(case_count_file) as json_file:
    case_count = json.loads(json_file.read())

validation_list = [x.lower() for x in all_postcode_suburb_list]
all_postcode_suburb_list = set(all_postcode_suburb_list)


@app.route("/", methods=["POST", "GET"])
def index():
    days = "active"
    if request.method == "POST":
        input_data = request.form
        days = input_data["days"]
        return render_template(
            "index.html",
            all_data=high_level_data,
            days_set=days,
            validation_set=all_postcode_suburb_list,
        )
    else:
        try:
            days_set = request.args["days"]
        except:
            days_set = "all"
        return render_template(
            "index.html",
            all_data=high_level_data,
            days_set=days_set,
            validation_set=all_postcode_suburb_list,
        )


@app.route("/postcode", methods=["POST", "GET"])
def postcode():
    print("-----------")
    if request.method == "POST":
        input_data = request.form
        days = "all"
        postcode = input_data["postcode"]
        try:
            source = input_data['source']
            days = input_data['days']
            postcode = input_data["postcode"]
        except:
            source = 'list_view'
        days_set = days
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
                    view_mode="map",
                    days_set=days_set
                )
            else:
                return render_template(
                    "postcode_error.html",
                    postcode=postcode.title(),
                    other_options=other_options,
                    all_options=all_options,
                    validation_set=all_postcode_suburb_list,
                    days_set=days_set
                )
        # Need to find if the search is not a post code so we can convert it
        if not postcode.startswith("2"):
            postcode = suburb_to_postcode_dict[postcode.lower()]
        if source == "list_view":
            close_postcodes_try = [
            int(postcode) - 1,
            int(postcode) - 2,
            int(postcode) + 1,
            int(postcode) + 2,
            ]
            close_postcodes = [
            str(x) for x in close_postcodes_try if str(x) in all_postcodes
            ]
            close_postcodes_all_data = {x: cases_data[x] for x in close_postcodes}
            close_postcodes_high_level = get_high_level(close_postcodes_all_data)
            return render_template(
                "postcode.html",
                postcode=postcode,
                days_set=days_set,
                validation_set=all_postcode_suburb_list,
                last_update=last_update,
                close_postcodes_data=close_postcodes_high_level,
                postcode_data=cases_data[postcode]
            )
        print(days_set)
        if days == "seven":
            if source == 'maps':
                temp_map_name = random_map_name()
                map_data = all_map('seven_days', postcode_zoom=postcode,zoom=13)
                map_data.save(temp_map_name)
                remove_bootstrap3(temp_map_name)
                just_the_file = os.path.split(temp_map_name)[-1]
                map_template = f"temp_maps/{just_the_file}"
                return render_template('map_direct.html', days_set="seven", view_mode="map", temp_map_name=map_template, temp_map = 'true')
        elif days == "fourteen":
            if source == 'maps':
                temp_map_name = random_map_name()
                map_data = all_map('fourteen_days', postcode_zoom=postcode,zoom=13)
                map_data.save(temp_map_name)
                remove_bootstrap3(temp_map_name)
                just_the_file = os.path.split(temp_map_name)[-1]
                map_template = f"temp_maps/{just_the_file}"
                return render_template('map_direct.html', days_set="fourteen", view_mode="map", temp_map_name=map_template, temp_map = 'true')
        elif days == "all":
            if source == 'maps':
                temp_map_name = random_map_name()
                map_data = all_map('all_days', postcode_zoom=postcode,zoom=13)
                map_data.save(temp_map_name)
                remove_bootstrap3(temp_map_name)
                just_the_file = os.path.split(temp_map_name)[-1]
                map_template = f"temp_maps/{just_the_file}"
                return render_template('map_direct.html', days_set="all", view_mode="map", temp_map_name=map_template, temp_map='true')
        else:
            temp_map_name = random_map_name()
            map_data = all_map('active_cases', postcode_zoom=postcode,zoom=13)
            map_data.save(temp_map_name)
            remove_bootstrap3(temp_map_name)
            just_the_file = os.path.split(temp_map_name)[-1]
            map_template = f"temp_maps/{just_the_file}"
            return render_template('map_direct.html', days_set="active", view_mode="map", temp_map_name=map_template, temp_map='true')         
    else:
        print(request.args["location"])
        postcode = request.args["location"]
        try:
            days_set = request.args["days"]
        except:
            days_set = "all"
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
        close_postcodes_all_data = {x: cases_data[x] for x in close_postcodes}
        close_postcodes_high_level = get_high_level(close_postcodes_all_data)
        return render_template(
            "postcode.html",
            postcode=postcode,
            days_set=days_set,
            validation_set=all_postcode_suburb_list,
            last_update=last_update,
            close_postcodes_data=close_postcodes_high_level,
            postcode_data=cases_data[postcode]
        )


@app.route('/sitemap.xml')
def site_map():
    return render_template('sitemap.xml')

@app.route('/map', methods=["POST", "GET"])
def map():
    if request.method == "POST":
        input_data = request.form
        try:
            days_set = input_data["days"]
        except:
            days_set = "all"
        return render_template('map_direct.html', days_set=days_set, view_mode="map",temp_map='false', validation_set=all_postcode_suburb_list)
    else:
        days_set = request.args["days"] or "all"
        return render_template('map_direct.html', days_set=days_set, view_mode="map",temp_map='false', validation_set=all_postcode_suburb_list)



@app.route('/allnsw', methods=["POST", "GET"])
def allnsw():
        postcode = "all"
        try:
            days_set = request.args["days"]
        except:
            days_set = "all"
        return render_template(
            "all_nsw.html",
            postcode=postcode,
            days_set=days_set,
            validation_set=all_postcode_suburb_list,
            last_update=last_update,
            postcode_data=cases_data[postcode]
        )

if __name__ == "__main__":
    app.run(host="0.0.0.0")
