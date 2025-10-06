class Player {
  #score;
  constructor(score, scoreDiv){
    this.#score = score;
    this.scoreDiv = scoreDiv
  }

  get score() {
    return this.#score;
  }

  set score(newScore) {
    if (newScore >= 0) {
      this.#score = newScore;
      this.scoreDiv.innerHTML = `<p>$${this.score}</p>`
      return true
    } else {
      alert("Your balance is to low!");
      return false
    }
    
  }
}


scoreDiv = document.getElementById("score")
let player = new Player(0, scoreDiv)

player.score = parseInt(scoreDiv.innerHTML)

let betInputID = "bet-input"
let betBtn = document.getElementById("bet-btn")

betBtn.addEventListener("click", () => {
  let bet = document.getElementById(`${betInputID}`).value;
  console.log(player.score)
  if (player.score -= bet) {
    console.log("works")
  } 
})





