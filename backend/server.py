from flask import Flask, request, render_template
import sqlite3
import os
from endpoints.commands import commands_endpoint
from endpoints.changelogs import changelogs_endpoint
from endpoints.stats import stats_endpoint
from endpoints.content import content_endpoint
from endpoints.character import character_endpoint
import sys

app = Flask(__name__, template_folder="templates", static_folder="../frontend/build", static_url_path="")
app.register_blueprint(commands_endpoint)
app.register_blueprint(changelogs_endpoint)
app.register_blueprint(stats_endpoint)
app.register_blueprint(content_endpoint)
app.register_blueprint(character_endpoint)


# This handles discord embeds which are routed here.
@app.route('/b/<name>')
def blorbo_page(name):
    user_agent = request.headers.get("User-Agent", "")

    is_bot = any(bot in user_agent.lower() for bot in [
        "discordbot",
        "twitterbot"
    ])

    if is_bot:
        connection = sqlite3.connect(os.getenv('JIFBOT_DB'))
        cursor = connection.cursor()
        cursor.execute(f"SELECT Key, Name, Description, ImageType FROM Character WHERE Key == ? ORDER BY Name ASC",
                       (name,))
        character = cursor.fetchone()

        if character is None:
            return app.send_static_file("index.html")

        image = ""
        if character[2] is not None and character[2] != "":
            image = f"{request.host_url}img/character/{character[0]}.{character[3]}"
        url = f"{request.host_url}b/{character[0]}"

        return render_template(
            "blorbo_embed.html",
            key=character[0],
            name=character[1],
            description=character[2],
            image=image,
            url=url
        )
    return app.send_static_file("index.html")


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "debug":
        app.run(debug=True)
    else:
        app.run(debug=False)