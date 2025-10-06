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


class Score:
    @staticmethod
    def get():
        id = get_user_id()
        return int(open(f"db/{id}").read())

    @staticmethod
    def set(x):
        id = get_user_id()
        open(f"db/{id}", "w").write(str(x))

    @staticmethod
    def add(x):
        Score.set(x+Score.get())


@app.route("/")
def index():
    return render_template("index.html", id=get_user_id())


@app.route("/get-score/")
def get_score():
    return str(Score.get())


@app.route("/roulette/")
def roulette():
    return render_template("roulette.html", score=Score.get())


@app.route("/roulette/spin/")
def roulette_spin():
    return ""


if __name__ == "__main__":
    app.run()
