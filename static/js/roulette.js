class Roulette {
    #angle = 0;
    #speed = 0;
    #acceleration = 0.1;
    #scoreToAdd = 0;

    constructor(wheel, bet_input, btn, roulette_name, sectors) {
        this.wheel = wheel;
        this.bet_input = bet_input;
        this.btn = btn;
        this.roulette_name = roulette_name;
        this.sectors = sectors;
        setInterval(this.upd.bind(this), 10);
        this.btn.on("click", this.spin.bind(this))
        this.drawWheel();
    }

    drawWheel() {
        let cxt = this.wheel[0].getContext("2d");
        let cx = 200, cy = 200, r = 200;
        let n = this.sectors.length;
        cxt.translate(cx, cy);
        cxt.rotate(-Math.PI / n);
        cxt.font = "20px Arial";
        this.sectors.forEach(m => {
            cxt.beginPath();
            cxt.moveTo(0, 0);
            cxt.arc(0, 0, r, -Math.PI / n - Math.PI / 2, Math.PI / n - Math.PI / 2);
            cxt.lineTo(0, 0);
            cxt.closePath();
            cxt.fillStyle = colorByMultiplier[m];
            cxt.fill();
            cxt.fillStyle = (cxt.fillStyle == "#000000" ? "white" : "black");
            cxt.fillText(`x${m}`, -15, -150);
            cxt.rotate(-2 * Math.PI / n);
        });
    }

    upd() {
        if (this.#speed > 0 && this.#speed - this.#acceleration <= 0) {
            this.handleStop();
        }
        if (this.#speed > 0) {
            this.#angle += (this.#speed + Math.max(0, this.#speed - this.#acceleration)) / 2 * Math.min(1, this.#speed / this.#acceleration);
        }
        while (this.#angle >= 360) {
            this.#angle -= 360;
        }
        this.#speed = Math.max(0, this.#speed - this.#acceleration);
        this.wheel.css({ rotate: `${this.#angle}deg` });
    }

    handleStop() {
        score += this.#scoreToAdd;
        this.#scoreToAdd = 0;
        this.btn.show();
    }

    spin() {
        let bet = this.bet_input.val();
        if (this.#speed > 0 && bet > score) return;
        score -= bet;
        this.btn.hide();
        var i;
        $.ajax({
            url: `/roulette/spin/${this.roulette_name}/${bet}`,
            async: false,
            success: function (data) {
                i = Number(data);
            }
        });
        this.#scoreToAdd = bet * this.sectors[i];
        let new_angle = (360.0 / this.sectors.length) * (i + Math.random());

        new_angle += 360 * (5 + Math.floor(Math.random() * 6));
        this.#speed = Math.sqrt(2 * this.#acceleration * (new_angle - this.#angle));
    }
}

let score = 0;
let colorByMultiplier = {
    0: "black",
    1: "lightgrey",
    2: "lightgreen",
    5: "cyan",
    10: "yellow",
    100: "#ff00ff"
}

$(function () {
    $.get("/get-score", function (data) {
        score = Number(data);
    })
    setInterval(upd_score, 10);
    roulette = new Roulette($("#wheel"), $("#bet_input"), $("#btn"), "r", roulette_data["r"]);
});

function upd_score() {
    $("#score").html(score);
}