from flask import Blueprint
import sqlite3
import os
import json
from datetime import datetime
from datetime import timedelta

stats_endpoint = Blueprint('stats_endpoint', __name__)


@stats_endpoint.route('/api/stats')
def stats():
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    monthData = get30DayData(cursor)
    yearData = getYearData(cursor)
    allTimeData = getAllTimeData(cursor)

    return json.dumps({
        "thirtyDay": monthData,
        "year": yearData,
        "allTime": allTimeData
    })


def getAllTimeData(cursor):
    cursor.execute(f"SELECT Command, COUNT(*) as count FROM CommandCall GROUP By Command ORDER BY count DESC")
    commands = cursor.fetchall()
    commandCounts = []
    for cmd in commands:
        commandCounts.append({"command": cmd[0], "count": cmd[1]})
    return {"commandCounts": commandCounts}


def getYearData(cursor):
    lastCutoff = datetime.today()
    currCutoff = datetime(lastCutoff.year, lastCutoff.month, 1)
    callCounts = []
    for x in range(0,12):
        cursor.execute(f"SELECT COUNT(*) FROM CommandCall WHERE Timestamp >= {currCutoff.timestamp()} AND Timestamp < {lastCutoff.timestamp()}")
        count = cursor.fetchone()
        callCounts.insert(0, {"month": currCutoff.strftime("%b"), "count": count[0]})
        lastCutoff = currCutoff
        currCutoff = getNextMonthDesc(currCutoff)
    return {"callsByMonth": callCounts}




def get30DayData(cursor):
    today = datetime.today()
    currCutoff = datetime(today.year, today.month, today.day)
    monthCutoff = currCutoff - timedelta(days=30)
    cursor.execute(f"SELECT Command, Timestamp FROM CommandCall WHERE Timestamp > {monthCutoff.timestamp()} ORDER BY Timestamp DESC")
    commandCalls = cursor.fetchall()

    commandCounts = {}
    callsByDay = []
    todayCount = 0
    dayCount = 1
    for cmd in commandCalls:
        if cmd[1] < currCutoff.timestamp():
            while cmd[1] < currCutoff.timestamp():
                callsByDay.insert(0, {"date": currCutoff.strftime('%m-%d'), "count": todayCount})
                todayCount = 0
                currCutoff = (currCutoff - timedelta(days=1))
                dayCount += 1
        todayCount += 1

        if cmd[0] not in commandCounts:
            commandCounts[cmd[0]] = 0
        commandCounts[cmd[0]] += 1

    # Handle any we may have missed
    while dayCount < 30:
        dayCount += 1
        currCutoff = (currCutoff - timedelta(days=1))
        callsByDay.insert(0, {"date": currCutoff.strftime('%m-%d'), "count": 0})

    sortedList = sorted(commandCounts.items(), key=lambda x: x[1], reverse=True)
    commandCounts = []
    for item in sortedList:
        commandCounts.append({"command": item[0], "count": item[1]})

    return {"callsByDay": callsByDay, "commandCounts": commandCounts}


def getNextMonthDesc(date):
    if date.month == 1:
        return datetime(date.year-1, 12, 1)
    else:
        return datetime(date.year, date.month-1, 1)
