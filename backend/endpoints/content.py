from flask import Blueprint, send_file
import sqlite3
import os
import io

content_endpoint = Blueprint('content_endpoint', __name__)


@content_endpoint.route('/img/character/<key>', methods=['GET'])
def image(key):
    connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
    cursor = connection.cursor()
    cursor.execute(f"SELECT Image, ImageType FROM Character WHERE Key == \"{key}\"")
    character = cursor.fetchone()

    return send_file(io.BytesIO(character[0]), mimetype=f"image/{character[1]}")
