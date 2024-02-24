from flask import Flask

app = Flask(__name__)

# Members API Route
@app.route("/commands")
def members():
    return {"commands": ["udefine", "define", "choose"]}
    
    
if __name__ == "__main__":
   app.run(debug=True)