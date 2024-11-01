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
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    monthData = get30DayData(cursor)
    allTimeData = getAllTimeData(cursor)


    return json.dumps({
        "thirtyDay": monthData,
        "allTime": allTimeData
    })


def getAllTimeData(cursor):
    cursor.execute(f"SELECT Command, COUNT(*) as count FROM CommandCall GROUP By Command ORDER BY count DESC")
    commands = cursor.fetchall()
    commandCounts = {}
    for cmd in commands:
        commandCounts[cmd[0]] = cmd[1]
    return {"commandCounts": commandCounts}


def get30DayData(cursor):
    monthCutoff = get30dayCutoff()
    cursor.execute(f"SELECT Command, Timestamp FROM CommandCall WHERE Timestamp > {monthCutoff} ORDER BY Timestamp DESC")
    commandCalls = cursor.fetchall()

    currCutoff = getTodayCutoff()
    currDayFormatted = datetime.utcfromtimestamp(currCutoff).strftime('%m-%d')
    dayCounts = {currDayFormatted: 0}
    commandCounts = {}
    for cmd in commandCalls:
        if cmd[1] < currCutoff:
            while cmd[1] < currCutoff:
                currCutoff = (datetime.utcfromtimestamp(currCutoff) - timedelta(days=1)).timestamp()
                currDayFormatted = datetime.utcfromtimestamp(currCutoff).strftime('%m-%d')
                dayCounts[currDayFormatted] = 0
        dayCounts[currDayFormatted] += 1

        if cmd[0] not in commandCounts:
            commandCounts[cmd[0]] = 0
        commandCounts[cmd[0]] += 1

    currCutoff = (datetime.utcfromtimestamp(currCutoff) - timedelta(days=1)).timestamp()
    while currCutoff > monthCutoff:
        currDayFormatted = datetime.utcfromtimestamp(currCutoff).strftime('%m-%d')
        dayCounts[currDayFormatted] = 0
        currCutoff = (datetime.utcfromtimestamp(currCutoff) - timedelta(days=1)).timestamp()

    commandCounts = dict(sorted(commandCounts.items(), key=lambda x: x[1], reverse=True))

    return {"callsByDay": dict(reversed(list(dayCounts.items()))), "commandCounts": commandCounts}


def getYearCutoff():
    today = datetime.today()
    monthStart = datetime(today.year, today.month, 1)
    # fuck leap years don't care
    yearAgo = monthStart - timedelta(days=365)
    return yearAgo.timestamp()


def get30dayCutoff():
    today = datetime.today()
    monthAgo = today - timedelta(days=30)
    return monthAgo.timestamp()


def getTodayCutoff():
    today = datetime.today()
    todayStart = datetime(today.year, today.month, today.day)
    return todayStart.timestamp()