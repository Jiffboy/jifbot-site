from flask import Blueprint
import sqlite3
import os
import json

commands_endpoint = Blueprint('commands_endpoint', __name__)


@commands_endpoint.route('/api/commands')
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

    cursor.execute(f"SELECT DISTINCT Category FROM Command ORDER BY Category ASC")
    categories = cursor.fetchall()
    categorylist = []
    for category in categories:
        categorylist += category

    return json.dumps({"categories": categorylist, "commands": commanddict})