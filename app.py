from flask import Flask, render_template, request, session
from datetime import timedelta
import random
from string import ascii_letters
from uuid import uuid4

app = Flask(__name__)
app.secret_key = "sk"
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(1e6)


def generate_id():
    return "".join(random.choices(ascii_letters, k=32))


def get_user_id():
    id = session.get("user")
    if not id:
        session.permanent = True
        session["user"] = uuid4()
        id = session["user"]
        open(f"db/{id}", "w").write("0")
    return id


def get_score():
    id = get_user_id()
    return int(open(f"db/{id}").read())


def set_score(x: int):
    id = get_user_id()
    open(f"db/{id}", "w").write(str(x))


def add_score(x: int):
    set_score(x+get_score())


@app.route("/")
def index():
    return render_template("index.html", id=get_user_id())


if __name__ == "__main__":
    app.secret_key = "sk"
    app.run()
