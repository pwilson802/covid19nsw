import folium
import csv
import pandas as pd
from collections import Counter, defaultdict
from datetime import datetime, timedelta

postcode_dict = {}
with open('nsw_postcodes.csv') as file:
    csv_file = csv.reader(file)
    next(csv_file)
    for line in csv_file:
        postcode = line[1]
        postcode_dict[postcode] = {}
        postcode_dict[postcode]['suburbs'] = line[2].title()
        postcode_dict[postcode]['map_location'] = [ float(line[5]), float(line[4]) ]
for line in all_data:
    postcode_dict[postcode]['postcode'] = postcode
    postcode_dict[postcode]['all_count'] = line['count']
    postcode_dict[postcode]['all_rank'] = line['rank']
    postcode_dict[postcode]['suburbs'] = line['suburbs']


sydney = postcode_dict['2000']['map_location']
m = folium.Map(sydney)

# m.location = picton
# carlton = postcode_dict['2218']['map_location']
# kog = postcode_dict['2217']['map_location']
for l in postcode_dict.keys():
    cases = int(postcode_dict[l]['all_count'])
    folium.Circle(
            location= postcode_dict[l]['map_location'],
            popup= f"Cases: {postcode_dict[l]['suburbs']}",
            tooltip= f'{1}: {cases}',
            radius= cases * 10  ,
            color='darkred',
            fill=True,
            fill_color='red',
        ).add_to(m)

m.save('map_test.html')


# home = postcode_dict['2219']['map_location']
# picton = postcode_dict['2571']['map_location']
# m = folium.Map(home, zoom_start=12)
