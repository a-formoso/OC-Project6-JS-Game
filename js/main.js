/************************
* TURN-BASED BOARD GAME
************************/


/** Creating Map "class"
=============================================================**/
function Map(nRows, nColumns, nWalls, nWeapons) { 
	this.x = nRows;
	this.y = nColumns;
	this.numbWalls = nWalls; 
	this.numbWeapons = nWeapons; 

	this.board = []; 
	this.wallWeapPlayersCells = []; //for 2D ref
	this.wallsPos = []; 
	this.weapons = []; 
	this.players = [];
} 

/** Map Instantiation 
=============================================================**/
var gameMap = new Map(9, 10, 12, 4); 
console.log(gameMap);



// Hiding Game Rules when user clicks to "Start" the game
var start_game = document.getElementById('start-game');
start_game.addEventListener('click', () => {
	document.getElementById('welcome-card').style.display = "none";
});

// New Game button
var newGame = document.getElementById('new-game');
newGame.onclick = (e) => {
	document.location.reload();
	e.preventDefault();
}