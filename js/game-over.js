/** 'Game Over' pop up window
=============================================================**/
gameTimeline = document.getElementById('timeline');
var opacityLayer = document.getElementById('opacity-layer');
var resultsCard = document.getElementById('results-card');
resultsCard.style.display = "none";
opacityLayer.style.display = "none";
var winnerImg = document.getElementById('winner-img');
var winnerName = document.getElementById('winner-name');
var winnerPts = document.getElementById('winner-pts');
var resultsCard_Btn = document.getElementById('resultsCard_Btn');

var resultsCardWinnerImg; //this.cssClass in Character object blueprint
var resultsCardWinnerPts; //this.health in Character
var resultsCardWinnerName; //this.name in Character

function gameResult() {
	//adding sound effect when a player looses
	var defending_Sound = new Audio("audio/game-over.wav");
	defending_Sound.play(); 

	var width = window.innerWidth;
	opacityLayer.style.display = "block";
	resultsCard.style.display = "block";
	resultsCard.style.left = (width/2) - 500/2 + "px"; //result is a string - eg 500px
	resultsCard.style.top = 150 + "px";
	// $("#winner-img").attr("src","images/player1.png"); 
	winnerImg.src="images/" + resultsCardWinnerImg + ".png";
	winnerImg.id="winner-img";
	winnerName.textContent = resultsCardWinnerName.toUpperCase() + " WINS!";
	winnerPts.textContent = resultsCardWinnerPts;
}
resultsCard_Btn.addEventListener('click', () => { 
	resultsCard.style.display = "none";
	// $('#results-card').slideUp(800);
	opacityLayer.style.display = "none";
});
// gameResult();
