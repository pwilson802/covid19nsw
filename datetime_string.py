from datetime import datetime, timedelta

day_endings = {
    '1': 'st',
    '2': 'nd',
    '3': 'rd',
    '21': 'st',
    '22': 'nd',
    '23': 'rd',
    '31': 'st'
}

def make_current_time_string():
    now = datetime.now() + timedelta(hours=8)
    time = now.strftime('%I:%M %p')
    day = now.strftime('%d')
    month = now.strftime('%B')
    year = now.strftime('%Y')
    if int(day) < 10:
        day = day[1]
    if day in day_endings.keys():
        day_end = day_endings[day]
    else:
        day_end = 'th'
    return f'{time} on the {day}{day_end} of {month} {year}'
