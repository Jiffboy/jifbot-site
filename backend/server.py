from flask import Flask
from endpoints.commands import commands_endpoint
from endpoints.changelogs import changelogs_endpoint
from endpoints.stats import stats_endpoint
from endpoints.content import content_endpoint
import sys

app = Flask(__name__)
app.register_blueprint(commands_endpoint)
app.register_blueprint(changelogs_endpoint)
app.register_blueprint(stats_endpoint)
app.register_blueprint(content_endpoint)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "debug":
        app.run(debug=True)
    else:
        app.run(debug=False)
