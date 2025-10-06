let angle = 0;
let speed = 0;
let acc = -1;

$(function () {
  upd_score();
  $("button").on("click", spin)
  setInterval(upd_roulette, 10);
});

function upd_roulette() {
  if (speed > 0 && speed + acc <= 0) {
    upd_score();
  }
  speed = Math.max(0, speed + acc);
  angle += speed;
  angle %= 360;
  $("#roulette").css({ transform: `rotate(${angle}deg)` });
}

function upd_score() {
  $.get(`/get-score`, function (data, status) {
    $("#score").html(data);
  });
}

function spin() {
  speed = 50
  bet = $("input").val();
  $.get(`/roulette/spin/${bet}`);
}