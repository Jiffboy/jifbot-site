from flask import Blueprint, request, jsonify
import sqlite3
import os
import json
import urllib.request
import random as randompy

character_endpoint = Blueprint('character_endpoint', __name__)

fields = "Key, UserId, Name, Description, Title, Occupation, Age, Race, Pronouns, Sexuality, Origin, Residence, Resources, ImageType"


@character_endpoint.route('/api/characters/<key>', methods=['GET'])
def character(key):
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    return get_characters(cursor, f"Key == \"{key}\"")


@character_endpoint.route('/api/characters/random', methods=['GET'])
def random():
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    cursor.execute("SELECT Key FROM Character ORDER BY RANDOM() LIMIT 1")
    target = cursor.fetchone()[0]

    return get_characters(cursor, f"Key == \"{target}\"")


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


@character_endpoint.route('/api/characters/author/<author>', methods=['GET'])
def author(author):
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    cursor.execute(f"SELECT UserId FROM User WHERE Name LIKE \"%{author}%\"")
    authors = [x[0] for x in cursor.fetchall()]
    authorString = ','.join("'{0}'".format(x) for x in authors)

    return get_characters(cursor, f"UserId in ({authorString})")


@character_endpoint.route('/api/characters/delete', methods=['POST'])
def delete():
    data = request.get_json()
    user_id, username = get_discord_info(data['tokenType'], data['accessToken'])

    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    cursor.execute("DELETE FROM Character WHERE Key = ? AND UserId = ?", (data['key'], user_id))

    connection.commit()
    connection.close()

    return json.dumps({"message": "Deleted successfully"})


@character_endpoint.route('/api/characters/submit', methods=['POST'])
def submit():
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()
    f = request.form
    image = None
    ext = None

    if 'image' in request.files:
        file = request.files['image']
        ext = file.filename.rsplit('.', 1)[1].lower()
        image = file.read()

    user_id, username = get_discord_info(f['tokenType'], f['accessToken'])

    # Keep the table up to date!
    cursor.execute("""
        INSERT INTO User (UserId, Name, Number)
        VALUES (?, ?, ?)
        ON CONFLICT(UserId) DO UPDATE SET
            UserId = excluded.UserId,
            Name = excluded.Name,
            Number = excluded.Number
    """, (user_id, username, 0))

    target = cursor.execute(f"SELECT UserId FROM Character WHERE Key = \"{f['originalKey']}\"", )
    key = target.fetchone()
    update = key is not None

    if update and key[0] != int(user_id):
        return jsonify({"error": "Using key for other user."}), 403

    values = (f['key'],
              user_id,
              f['name'],
              f['description'],
              f['title'],
              f['occupation'],
              f['age'],
              f['race'],
              f['pronouns'],
              f['sexuality'],
              f['origin'],
              f['residence'],
              f['resources'],
              ext,
              image,
              1)
    template = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    try:
        if update:
            cursor.execute("""
                UPDATE Character
                SET Key = ?, UserId = ?, Name = ?, Description = ?, Title = ?, Occupation = ?, Age = ?, Race = ?, 
                Pronouns = ?, Sexuality = ?, Origin = ?, Residence = ?, Resources = ?, ImageType = ?, Image = ?, 
                CompactImage = ?
                WHERE Key = ?
            """, values + (f['originalKey'],))
        else:
            cursor.execute(f"INSERT INTO Character ({fields}, Image, CompactImage) VALUES {template}", values)
    except sqlite3.IntegrityError as e:
        if "UNIQUE constraint failed" in str(e):
            return jsonify({"error": "Key in use for other character"}), 403
        else:
            return jsonify({"error": "An unexpected error has occurred"}), 500
    except Exception:
        return jsonify({"error": "An unexpected error has occurred"}), 500

    connection.commit()
    connection.close()

    return character(f['key'])


def get_characters(cursor, conditions):
    cursor.execute(f"SELECT {fields} FROM Character WHERE {conditions} ORDER BY Name ASC")
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
    if character[13] is not None and character[13] != "":
        image = f"{request.host_url}img/character/{character[0]}.{character[13]}"

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


def get_discord_info(tokenType, accessToken):
    headers = {
        "Authorization": f"{tokenType} {accessToken}",
        "User-Agent": "MyDiscordApp (https://jifbot.com, v1.0)"
    }

    req = urllib.request.Request('https://discord.com/api/users/@me', headers=headers)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        return data['id'], data['username']
