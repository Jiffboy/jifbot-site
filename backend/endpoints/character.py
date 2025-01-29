from flask import Blueprint
import sqlite3
import os
import json

character_endpoint = Blueprint('character_endpoint', __name__)


@character_endpoint.route('/api/character/<key>', methods=['GET'])
def character(key):
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()
    cursor.execute(f"SELECT Key, UserId, Name, Description, Title, Occupation, Age, Race, Pronouns, Sexuality, Origin, Residence, Resources, ImageType FROM Character WHERE Key == \"{key}\"")
    character = cursor.fetchone()
    characterJson = buildCharacterJson(cursor, character)
    return json.dumps({"characters": {character[0]: characterJson}})


@character_endpoint.route('/api/character/search/<search>', methods=['GET'])
def search(search):
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()
    cursor.execute(f"SELECT Key FROM CharacterAlias WHERE Alias LIKE \"%{search}%\"")
    aliasKeys = [x[0] for x in cursor.fetchall()]
    cursor.execute(f"SELECT Key FROM CharacterTag WHERE Tag LIKE \"%{search}%\"")
    tagKeys = [x[0] for x in cursor.fetchall()]
    # This code is between me and God
    allKeys = list(set(aliasKeys) | set(tagKeys))
    listString = ','.join("'{0}'".format(x.replace("\'", "\'\'")) for x in allKeys)
    cursor.execute(f"SELECT Key, UserId, Name, Description, Title, Occupation, Age, Race, Pronouns, Sexuality, Origin, Residence, Resources, ImageType FROM Character WHERE Name LIKE \"%{search}%\" OR Key in ({listString})")
    characters = cursor.fetchall()

    charactersJson = {}
    for character in characters:
        charactersJson[character[0]] = buildCharacterJson(cursor, character)

    return json.dumps({"characters": charactersJson})


def buildCharacterJson(cursor, character):
    cursor.execute(f"SELECT Name FROM User WHERE UserId == \"{character[1]}\"")
    user = cursor.fetchone()
    cursor.execute(f"SELECT Alias FROM CharacterAlias WHERE Key == \"{character[0]}\"")
    aliases = cursor.fetchall()
    aliases = "" if len(aliases) == 0 else ','.join(x[0] for x in aliases)
    cursor.execute(f"SELECT Tag FROM CharacterTag WHERE Key == \"{character[0]}\"")
    tags = cursor.fetchall()
    tags = "" if len(tags) == 0 else ','.join(x[0] for x in tags)

    image = ""
    if character[13] != None:
        image = f"https://jifbot.com/img/character/{character[0]}.{character[13]}"

    dict = {
        "name": character[2],
        "aliases": aliases,
        "description": character[3],
        "title": character[4],
        "occupation": character[5],
        "age": character[6],
        "race": character[7],
        "pronouns": character[8],
        "sexuality": character[9],
        "origin": character[10],
        "residence": character[11],
        "tags": tags,
        "resources": character[12],
        "image": image,
        "author": user[0]
    }

    return {k: v for k, v in dict.items() if v}

