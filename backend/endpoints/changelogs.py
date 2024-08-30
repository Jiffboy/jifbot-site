from flask import Blueprint
import sqlite3
import os
import json

changelogs_endpoint = Blueprint('changelogs_endpoint', __name__)

@changelogs_endpoint.route('/api/changelogs')
def changelogs():
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM ChangeLog ORDER BY Date DESC")
    changelogs = cursor.fetchall()

    jsondict = {}
    currDate = ''
    currList = []
    for changelog in changelogs:
        # We've found all records for this date, push
        if changelog[0] != currDate:
            # If this is our first pass through, don't add to list
            if not currList:
                currDate = changelog[0]
            else:
                jsondict[currDate] = currList
                currDate = changelog[0]
                currList = []
        currList.append(changelog[1])
    jsondict[currDate] = currList

    return json.dumps({"changelogs": jsondict})