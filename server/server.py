from flask import Flask
import sqlite3
import os
import json

app = Flask(__name__)


# Commands API Route
@app.route("/commands")
def commands():
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Command")
    commands = cursor.fetchall()

    jsondict = {}
    for cmd in commands:
        jsondict[cmd[0]] = {
            "category": cmd[1],
            "description": cmd[2]
        }

    return json.dumps(jsondict)


@app.route("/changelogs")
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

    return json.dumps(jsondict)
    
if __name__ == "__main__":
   app.run(debug=True)