from flask import Blueprint, request, jsonify
import sqlite3
import os
import json
import urllib.request

character_endpoint = Blueprint('character_endpoint', __name__)

fields = [
    "Id",
    "UserId",
    "Name",
    "Description",
    "Title",
    "Occupation",
    "Age",
    "Race",
    "Pronouns",
    "Sexuality",
    "Origin",
    "Residence",
    "Resources",
    "ImageType",
    "Image",
    "CompactImage"
]


@character_endpoint.route('/api/characters/<id>', methods=['GET'])
def character(id):
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    return get_characters(cursor, f"Id == \"{id}\"")


@character_endpoint.route('/api/characters/random', methods=['GET'])
def random():
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    cursor.execute("SELECT Id FROM Character ORDER BY RANDOM() LIMIT 1")
    target = cursor.fetchone()[0]

    return get_characters(cursor, f"Id == \"{target}\"")


@character_endpoint.route('/api/characters/search/<search>', methods=['GET'])
def search(search):
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()

    cursor.execute(f"SELECT Id FROM CharacterAlias WHERE Alias LIKE \"%{search}%\" AND Id IS NOT NULL")
    aliasIds = [x[0] for x in cursor.fetchall()]
    cursor.execute(f"SELECT Id FROM CharacterTag WHERE Tag LIKE \"%{search}%\" AND Id IS NOT NULL")
    tagIds = [x[0] for x in cursor.fetchall()]
    # This code is between me and God
    allIds = list(set(aliasIds) | set(tagIds))
    listString = ','.join(str(x) for x in allIds)

    return get_characters(cursor, f"Name LIKE \"%{search}%\" OR Id in ({listString})")


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

    cursor.execute("DELETE FROM Character WHERE Id = ? AND UserId = ?", (data['id'], user_id))

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
    print(f)

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

    target = cursor.execute(f"SELECT UserId FROM Character WHERE Id = \"{f['id']}\"", )
    id = target.fetchone()
    update = id is not None

    if update and id[0] != int(user_id):
        return jsonify({"error": "Character does not belong to this user."}), 403

    values = (f['id'],
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
    template = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    try:
        if update:
            formattedFields = ','.join(f"{field} = ?" for field in fields)
            cursor.execute(f"UPDATE Character SET {formattedFields} WHERE Id = ?", values + (f['id'],))
            charId = f['id']
        else:
            cursor.execute(f"INSERT INTO Character ({', '.join(fields[1:])}) VALUES {template}", values[1:])
            charId = cursor.lastrowid
    except Exception as e:
        return jsonify({"error": "An unexpected error has occurred"}), 500

    connection.commit()
    connection.close()

    return character(charId)


def get_characters(cursor, conditions):
    cursor.execute(f"SELECT {','.join(fields[:-2])} FROM Character WHERE {conditions} ORDER BY Name ASC")
    characters = cursor.fetchall()

    charactersJson = {}
    for character in characters:
        charactersJson[character[0]] = build_character_json(cursor, character)

    return json.dumps({"characters": charactersJson})


def build_character_json(cursor, character):
    cursor.execute(f"SELECT Name FROM User WHERE UserId == \"{character[1]}\"")
    user = cursor.fetchone()
    cursor.execute(f"SELECT Alias FROM CharacterAlias WHERE Id == \"{character[0]}\"")
    aliases = cursor.fetchall()
    aliases = "" if len(aliases) == 0 else [alias[0] for alias in aliases]
    cursor.execute(f"SELECT Tag FROM CharacterTag WHERE Id == \"{character[0]}\"")
    tags = cursor.fetchall()
    tags = "" if len(tags) == 0 else [tag[0] for tag in tags]

    image = ""
    if character[13] is not None and character[13] != "":
        image = f"{request.host_url}img/character/{character[0]}.{character[13]}"

    dict = {
        "id": character[0],
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
