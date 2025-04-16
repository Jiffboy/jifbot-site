from flask import Blueprint
import sqlite3
import os
import json
import random as randompy

character_endpoint = Blueprint('character_endpoint', __name__)

select_string = "SELECT Key, UserId, Name, Description, Title, Occupation, Age, Race, Pronouns, Sexuality, Origin, Residence, Resources, ImageType FROM Character"


@character_endpoint.route('/api/characters/<key>', methods=['GET'])
def character(key):
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    return get_characters(cursor, f"Key == \"{key}\"")


@character_endpoint.route('/api/characters/random', methods=['GET'])
def random():
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    cursor.execute("SELECT Count() FROM Character")
    count = cursor.fetchone()[0]
    target = randompy.randrange(0, count)
    return get_characters(cursor, f"_ROWID_ == {target}")


@character_endpoint.route('/api/characters/search/<search>', methods=['GET'])
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

    return get_characters(cursor, f"Name LIKE \"%{search}%\" OR Key in ({listString})")


def get_characters(cursor, conditions):
    cursor.execute(f"{select_string} WHERE {conditions}")
    characters = cursor.fetchall()

    charactersJson = {}
    for character in characters:
        charactersJson[character[0]] = build_character_json(cursor, character)

    return json.dumps({"characters": charactersJson})


def build_character_json(cursor, character):
    cursor.execute(f"SELECT Name FROM User WHERE UserId == \"{character[1]}\"")
    user = cursor.fetchone()
    cursor.execute(f"SELECT Alias FROM CharacterAlias WHERE Key == \"{character[0]}\"")
    aliases = cursor.fetchall()
    aliases = "" if len(aliases) == 0 else [alias[0] for alias in aliases]
    cursor.execute(f"SELECT Tag FROM CharacterTag WHERE Key == \"{character[0]}\"")
    tags = cursor.fetchall()
    tags = "" if len(tags) == 0 else [tag[0] for tag in tags]

    image = ""
    if character[13] is not None:
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

