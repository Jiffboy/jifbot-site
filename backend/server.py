from flask import Flask
import sqlite3
import os
import json
import sys

app = Flask(__name__)


# Commands API Route
@app.route("/api/commands")
def commands():
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Command ORDER BY Name ASC")
    commands = cursor.fetchall()

    commanddict = {}
    for cmd in commands:
        commanddict[cmd[0]] = {
            "category": cmd[1],
            "description": cmd[2]
        }

        cursor.execute(f"SELECT * FROM CommandParameter WHERE Command='{cmd[0]}' ORDER BY Required DESC, Name ASC")
        parameters = cursor.fetchall()
        if parameters:
            commanddict[cmd[0]]["parameters"] = {}
            for param in parameters:
                commanddict[cmd[0]]["parameters"][param[1]] = {
                    "description": param[2],
                    "required": param[3]
                }

    cursor.execute(f"SELECT DISTINCT Category FROM Command ASC")
    categories = cursor.fetchall()
    categorylist = []
    for category in categories:
        categorylist += category

    return json.dumps({"categories": categorylist,"commands": commanddict})


@app.route("/api/changelogs")
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


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "debug":
        app.run(debug=True)
    else:
        app.run(debug=False)
