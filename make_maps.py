from maps import popup_html, all_map, remove_bootstrap3, random_map_name
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
maps_folder = os.path.join(template_folder, "maps")
temp_map_dir = os.environ.get("COVID_TEMP_MAP_FOLDER")

high_level_data_file = os.path.join(data_folder, 'high_level_data.json')
map_all_file = os.path.join(maps_folder, "map_all.html")
map_fourteen_file = os.path.join(maps_folder, "map_fourteen.html")
map_seven_file = os.path.join(maps_folder, "map_seven.html")
map_active_file = os.path.join(maps_folder, "map_active.html")

popup_html = """
    <h1 class="postcode">POSTCODE</h1>
    <h3 class = "today-count">Cases: NUM_CASES</h3>
    <p>
    <a href = "https://covid19nsw.com/postcode?location=POSTCODE"> More Details</a>
    </p>
    """

with open(high_level_data_file) as f:
    high_level_data = json.loads(f.read())


all_day_map = all_map('all_days')
fourteen_day_map = all_map('fourteen_days')
seven_day_map = all_map('seven_days')
active_day_map = all_map('active_cases')


all_day_map.save(map_all_file)
fourteen_day_map.save(map_fourteen_file)
seven_day_map.save(map_seven_file)
active_day_map.save(map_active_file)

for file in [map_all_file, map_fourteen_file, map_seven_file, map_active_file]:
    remove_bootstrap3(file)