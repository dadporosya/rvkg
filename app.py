from flask import Flask, render_template, request, session, url_for
from markupsafe import Markup
from datetime import timedelta
import random
from string import ascii_letters
from uuid import uuid4
import json

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
    return render_template("index.html", score=get_score())


@app.route("/get-score/")
def get_score():
    return str(Score.get())


def get_roulettes():
    return json.load(open("roulettes.json"))


@app.route("/roulette/")
def roulette():
    return render_template("roulette.html",
                           score=Score.get(),
                           roulette_data=Markup(get_roulettes()),
                           roulette_image=url_for("static", filename="r1.png"))


@app.route("/roulette/spin/<string:roulette_name>/<int:bet>")
def roulette_spin(roulette_name: str, bet: int):
    sectors: list[int] = get_roulettes()[roulette_name]
    if bet < 1 or bet > Score.get() or len(sectors) == 0:
        return "-1"
    Score.add(-bet)
    i = random.randrange(len(sectors))
    Score.add(bet*sectors[i])
    res = str(i)
    return res


if __name__ == "__main__":
    app.run()
