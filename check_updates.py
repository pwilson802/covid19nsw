import os
import json
import pandas as pd
import sys
from datetime_string import make_current_time_string
import subprocess
import logging
data_folder = os.environ.get("COVID_DATA")
logging.basicConfig(filename='/var/log/covid_update', 
                    filemode='a',
                    format='%(asctime)s - %(message)s', 
                    datefmt='%d-%b-%y %H:%M:%S')
logfile = '/var/log/covid19nsw_log'

count_file = os.path.join(data_folder, "nsw_count")
last_update_file = os.path.join(data_folder, "last_update_time")

csv_file = "https://data.nsw.gov.au/data/dataset/97ea2424-abaf-4f3e-a9f2-b5c883f42b6a/resource/2776dbb8-f807-4fb2-b1ed-184a6fc2c8aa/download/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv"

covid_frame = pd.read_csv(csv_file)

# Find if the count has changed if it has not don't load the new data
new_count = len(covid_frame.index)
with open(count_file) as c:
    previous_count = int(c.readlines()[0])

if new_count == previous_count:
    sys.exit()
else:
    with open(count_file, 'w') as c:
        c.write(f"{new_count}")
    with open(last_update_file, 'w') as u:
        u.write(make_current_time_string())

logging.warning(f"count update from {previous_count} to {new_count}")
logging.warning(f"Last update: {make_current_time_string()}")
subprocess.call(['/home/scripts/covid19reload.sh'])