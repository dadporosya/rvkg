$(function () {
  upd_score();
  $("button").on("click", spin)
});

function upd_score() {
  $.get(`/get-score`, function (data, status) {
    $("#score").html(data);
  });
}

function spin() {
  bet = $("input").val();
  $.get(`/roulette/spin/${bet}`, function (data, status) {
    if (data == "1") {
      $("#result").html("win");
    } else {
      $("#result").html("loss");
    }
    upd_score();
  });
}