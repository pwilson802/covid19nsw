import folium
import csv
import os
import json
import pandas as pd
from random import choice
import string
from collections import Counter, defaultdict
from datetime import datetime, timedelta
data_folder = os.environ.get("COVID_DATA")
template_folder = os.environ.get("COVID_TEMPLATES")
temp_map_dir = os.environ.get("COVID_TEMP_MAP_FOLDER")

map_data_file = os.path.join(data_folder, "map_data.json")
# Add some random stuff to the below file when we go live
map_all_file = os.path.join(template_folder, "map_all.html")
map_fourteen_file = os.path.join(template_folder, "map_fourteen.html")
map_seven_file = os.path.join(template_folder, "map_seven.html")

popup_html = """
    <h1 class="postcode">POSTCODE</h1>
    <h3 class = "today-count">Cases: NUM_CASES</h3>
    <p>
    <a href = "https://covid19nsw.com/postcode?location=POSTCODE"> More Details</a>
    </p>
    """


with open(map_data_file) as json_file:
    postcode_dict = json.loads(json_file.read())

def all_map(data, postcode_zoom='2016', postcode_dict = postcode_dict, zoom=12):
    # Add data for all cases
    sydney = postcode_dict[postcode_zoom]['map_location']
    cases_map = folium.Map(sydney, zoom_start=zoom)
    if data == "all_count":
        large, big, medium = 100, 40, 20
        multiply = 14
    if data == "fourteen_day_count":
        large, big, medium = 20, 10, 5
        multiply = 28
    if data == "seven_day_count":
        large, big, medium = 10, 3, 2
        multiply = 56
    for l in postcode_dict.keys():
        cases = int(postcode_dict[l][data])
        if cases > large:
            outer_color = 'darkred'
            iner_color = 'red'
        elif cases > big:
            outer_color = 'darkpurple'
            iner_color = 'purple'
        elif cases > medium:
            outer_color = 'darkblue'
            iner_color = 'blue'
        else:
            outer_color = 'darkgreen'
            iner_color = 'green'
        circle_size = cases * multiply
        if circle_size > 1000:
            circle_size = 1000
        if 0 < circle_size < 200:
            circle_size = 200
        folium.Circle(
                location= postcode_dict[l]['map_location'],
                popup= folium.Popup(popup_html.replace('POSTCODE', str(l)).replace('NUM_CASES', str(cases)), min_width=140, max_width=140),
                tooltip= f'{cases}',
                radius= circle_size ,
                color=iner_color,
                fill=True,
                fill_color=outer_color,
            ).add_to(cases_map)
    return cases_map
    
all_day_map = all_map('all_count')
fourteen_day_map = all_map('fourteen_day_count')
seven_day_map = all_map('seven_day_count')


all_day_map.save(map_all_file)
fourteen_day_map.save(map_fourteen_file)
seven_day_map.save(map_seven_file)

# Need to save the file as a new file and update the template include the new file before retarting app.
# Going to remove bootstrap 3 from the map file as it messes with the navbar and doens't appear to degrade anything.


def remove_bootstrap3(file):
    to_remove = 'maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css'
    with open(file, "r") as f:
        lines = f.readlines()
    with open(file, "w") as f:
        for line in lines:
            if to_remove not in line:
                f.write(line)
    return(f'completed file {file}')

for file in [map_all_file, map_fourteen_file, map_seven_file]:
    remove_bootstrap3(file)

def random_map_name():
    temp_name = ''.join([choice(string.ascii_letters) for x in range(12)])
    return os.path.join(temp_map_dir, f'{temp_name}.html')