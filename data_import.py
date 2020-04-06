import requests
import json
import csv
import pandas as pd
from collections import Counter

# url = "https://data.nsw.gov.au/data/api/3/action/datastore_search?resource_id=21304414-1ff1-4243-a5d2-f52778048b29"
# url2 = 'https://data.nsw.gov.au/data/api/3/action/datastore_search?offset=100&resource_id=21304414-1ff1-4243-a5d2-f52778048b29'
# c = requests.get(url)
# data = json.loads(c.text)['result']['records']
# df = pd.DataFrame.from_dict(data)

csv_file = 'https://data.nsw.gov.au/data/dataset/aefcde60-3b0c-4bc0-9af1-6fe652944ec2/resource/21304414-1ff1-4243-a5d2-f52778048b29/download/covid-19-cases-by-notification-date-and-postcode-local-health-district-and-local-government-area.csv'

covid_frame = pd.read_csv(csv_file)
all_data_list = list(covid_frame['postcode'])
cleaned_list = [int(x) for x in all_data_list if str(x).startswith('2')]

