from flask import Blueprint
import sqlite3
import os
import json
import collections
from datetime import datetime
from datetime import timedelta

stats_endpoint = Blueprint('stats_endpoint', __name__)


@stats_endpoint.route('/api/stats')
def stats():
    yearCutoff = getYearCutoff()
    monthCutoff = getMonthCutoff()
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()
    cursor.execute(f"SELECT Command, Timestamp FROM CommandCall WHERE Timestamp > {monthCutoff} ORDER BY Timestamp DESC")
    commandCalls = cursor.fetchall()

    # Month Data
    currCutoff = getTodayCutoff()
    currDayFormatted = datetime.utcfromtimestamp(currCutoff).strftime('%Y-%m-%d')
    dayCounts = {currDayFormatted: 0}
    commandCounts = {}
    for cmd in commandCalls:
        if cmd[1] < currCutoff:
            while cmd[1] < currCutoff:
                currCutoff = (datetime.utcfromtimestamp(currCutoff) - timedelta(days=1)).timestamp()
                currDayFormatted = datetime.utcfromtimestamp(currCutoff).strftime('%Y-%m-%d')
                dayCounts[currDayFormatted] = 0
        dayCounts[currDayFormatted] += 1

        if cmd[0] not in commandCounts:
            commandCounts[cmd[0]] = 0
        commandCounts[cmd[0]] += 1

    commandCounts = dict(sorted(commandCounts.items(), key=lambda x:x[1], reverse=True))
    return json.dumps({"30day": {"callsByDay": dayCounts, "commandCounts": commandCounts}})


def getYearCutoff():
    today = datetime.today()
    monthStart = datetime(today.year, today.month, 1)
    # fuck leap years don't care
    yearAgo = monthStart - timedelta(days=365)
    return yearAgo.timestamp()


def getMonthCutoff():
    today = datetime.today()
    monthAgo = today - timedelta(days=30)
    return  monthAgo.timestamp()

def getTodayCutoff():
    today = datetime.today()
    todayStart = datetime(today.year, today.month, today.day)
    return todayStart.timestamp()