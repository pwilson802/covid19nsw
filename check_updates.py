import os
import json
import pandas as pd
import sys
from datetime_string import make_current_time_string
import subprocess
import logging
import time
data_folder = os.environ.get("COVID_DATA")
lock_file = os.path.join(data_folder, "check_update.lck")
if os.path.isfile(lock_file):
    # The script is still running
    sys.exit()

with open(lock_file, 'w') as f:
    f.write('file is locked')

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
print('starting check of file count')
new_count = len(covid_frame.index)
with open(count_file) as c:
    previous_count = int(c.readlines()[0])

if new_count == previous_count:
    os.remove(lock_file)
    sys.exit()
else:
    with open(count_file, 'w') as c:
        c.write(f"{new_count}")
    with open(last_update_file, 'w') as u:
        u.write(make_current_time_string())

logging.warning(f"count update from {previous_count} to {new_count}")
logging.warning(f"Last update: {make_current_time_string()}")
# print('file updated starting reload')
# subprocess.call(['/home/scripts/covid19reload.sh'])

def cases_count():
    main_cases_file = os.path.join(data_folder, 'cases_file_latest.json')
    with open(main_cases_file) as f:
        cases_data = json.loads(f.read())
    return cases_data['all']['all_days']['cases']

loop = True
while loop:
    logging.warning("Starting the loop to call the reload script")
    subprocess.call(['/home/scripts/covid19reload.sh'])
    current_count = cases_count()
    time.sleep(60)
    if current_count == new_count:
        logging.warning("The local data was succesfully updated")
        loop = False

os.remove(lock_file)
