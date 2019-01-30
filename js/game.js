/************************
* TURN-BASED BOAR GAME
***********************/


/** Creating blueprint, map, using a constructor function
=============================================================**/
function map(nRows, nColumns, nWalls, nWeapons) { //assigned arguments: 9, 10, 12, 4
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

/** Creating map object instance: Board
=============================================================**/
map.prototype.Board = function() {
	//Create 9 tr's
	for (var i = 0; i < this.x; i++) { //9 rows
		var row = [];
		var tr = $('<tr></tr>');
		$('#grid').append(tr);
		//create 10 td's for each tr
		for (var j = 0; j < this.y; j++) { //10 cells
			var td = $('<td></td>');
	    	row.push(td); 
	    	tr.append(td);
		}
		this.board.push(row); //the opposite .unshift() adds to the beginning
	}
};

/** Creating map object instance: Walls (game obstacles)
=============================================================**/
map.prototype.Walls = function() {
	//randomly create 12 unique numbers 
	while(this.wallWeapPlayersCells.length < this.numbWalls) { //numbWalls = 12
    	var tdNo = Math.ceil(Math.random()*(this.board[0].length*this.board.length) - 1); //tdNo ranges between 0-89 (Math.random()*(10*9 = 90-1)
    	if(this.wallWeapPlayersCells.indexOf(tdNo) > -1) continue; 
    	this.wallWeapPlayersCells[this.wallWeapPlayersCells.length] = tdNo;
    }
	//identify the x and y coordinates from Wall numbers created, add class 'wall'
	for (var i = 0; i < this.numbWalls; i ++) { 
  		var x = Math.floor(this.wallWeapPlayersCells[i] / this.board[0].length); //eg: 65/10 = 6.5, Math.floor(6.5) = 6 //x=6
  		var y = this.wallWeapPlayersCells[i] - x * this.board[0].length; //65-6*10 (multiplication first) //y=5 
 		this.board[x][y].addClass('wall');  
		this.wallsPos.push({x: x, y: y});	//index[key: property]
	}
};

/** Creating the Weapon "class"
===============================================**/
var Weapon = {
  //initialise object prototype
  initWeapon: function (type, name, damage, cssClass) {
    this.type = type;
    this.name = name;
    this.damage = damage;
    this.cssClass = cssClass;
 	this.position = {x:0, y:0};
  }
}; 

/** Creating map object instance: Weapons
=============================================================**/
map.prototype.Weapons = function() {
	var html = Object.create(Weapon);
	html.initWeapon("Markup", "HTML", "20", "weapon weapon-1"); //type, name, damage, cssClass
	var css = Object.create(Weapon);
	css.initWeapon("Markup", "CSS", "50", "weapon weapon-2");
	var js = Object.create(Weapon);
	js.initWeapon("Scripting", "JS", "70", "weapon weapon-3");
	var cPlusPlus = Object.create(Weapon);
	cPlusPlus.initWeapon("Object-Oriented", "C++", "90", "weapon weapon-4");
	//add weapons to the blueprint 
	var badges = [html, css, js, cPlusPlus];
	this.weapons = badges;
	//randomly create 4 unique numbers
	while(this.wallWeapPlayersCells.length < this.numbWalls + this.numbWeapons) { //12 < 16
		var tdNo = Math.ceil(Math.random()*(this.board[0].length*this.board.length) - 1);
		if(this.wallWeapPlayersCells.indexOf(tdNo) > -1) { 
			continue; 
		} 		
		this.wallWeapPlayersCells[this.wallWeapPlayersCells.length] = tdNo;
	}
	//identify x and y coordinates, place weapons on the map 
	for (var i = this.numbWalls; i < this.wallWeapPlayersCells.length; i ++) {  //12 < 16
  		var x = Math.floor(this.wallWeapPlayersCells[i] / this.board[0].length); 
  		var y = this.wallWeapPlayersCells[i] - x * this.board[0].length; 
		this.board[x][y].addClass(this.weapons[i - this.numbWalls].cssClass);	//i=12-12, weapons[0].cssClass 
		this.weapons[i - this.numbWalls].position.x = x; 
		this.weapons[i - this.numbWalls].position.y = y;	
	}	
};

/** Creating the players blueprint, Character
===============================================**/
var Character = {
    //Initialise character
    initCharacter: function (name, health, cssClass) {
        this.name = name; //Axiom, Bilkis
        this.health = health;
		var defaultWeapon = Object.create(Weapon);
		defaultWeapon.initWeapon("WebDev", "OPC", 10, "weapon weapon-0"); //type, name, damage, cssClass
        this.currentWeapon = defaultWeapon;
        this.cssClass = cssClass; //player1, player2
        this.position = {x:0, y:0};
    },
	info: function () {
	    var description = this.name + " has " + this.health + " health points and " +
	        this.currentWeapon.damage + " (" + this.currentWeapon.name + ") weapon points";
	    return description;
	},
	status: function () {
		var describe = this.name + " picks up new weapon: " + this.currentWeapon.name + ". " + 
		this.name + " can now inflict " + this.currentWeapon.damage + " pts damage";
		return describe;
	},
    attack: function (target) {
        if (this.health > 0) {
            var damage = this.currentWeapon.damage;
            // console.log(this.name + " attacks " + target.name + " and inflicts " + damage + " damage pts");
            target.health = target.health - damage;
            gameTimeline.innerHTML = this.name + " attacks " + target.name + " and inflicts " + damage + " damage pts";
            if (target.name === "Axiom") {
            	document.getElementById('pl1-health-pts').innerHTML = target.health;
            	if (target.health > 0 && target.health <= 50) {
					document.getElementById('pl1-health-pts').style.color = "orange";
				}
            	if (target.health > 0 && target.health <= 20) {
					document.getElementById('pl1-health-pts').style.color = "red";
				}
            }
            if (target.name === "Bilkis") {
            	document.getElementById('pl2-health-pts').innerHTML = target.health;
            	if (target.health > 0 && target.health <= 50) {
					document.getElementById('pl2-health-pts').style.color = "orange";
				}
            	if (target.health > 0 && target.health <= 20) {
					document.getElementById('pl2-health-pts').style.color = "red";
				}
            }
            if (target.health > 0) {
                console.log("Attack launched. " + target.name + " has " + target.health + " health points left");
                gameTimeline.innerHTML = "Attack launched. " + target.name + " has " + target.health + " health points left";
            }
            else {
                target.health = 0;
                console.log(target.name + " has been eliminated!");
                //bring popup window with results
            }
        } 
        else {
            console.log(this.name + " can't attack (they've been eliminated).");
        }
    }
};

/** Creating map object instance: Players
=============================================================**/
map.prototype.Players = function() {
	//player1 and player2 as global variabes
	player1 = Object.create(Character);
	player1.initCharacter("Axiom", 100, "player1"); 
	player2 = Object.create(Character);
	player2.initCharacter("Bilkis", 100, "player2");
	//adding players to the blueprint
	var spaceships = [player1, player2]; 
	this.players = spaceships;
	//randomly create 2 unique values
	while(this.wallWeapPlayersCells.length < this.numbWalls + this.numbWeapons + spaceships.length) {
		var tdNo = Math.ceil(Math.random()*(this.board[0].length*this.board.length) - 1);
		if(this.wallWeapPlayersCells.indexOf(tdNo) > -1) { 
			continue; 
		} 		
		this.wallWeapPlayersCells[this.wallWeapPlayersCells.length] = tdNo;
	}
	//identify x and y coordinates, add player classes and current weapon class
	for (var i = this.numbWalls + this.numbWeapons; i < this.wallWeapPlayersCells.length; i ++) { //i = 16; i < 18; i++
  		var x = Math.floor(this.wallWeapPlayersCells[i] / this.board[0].length); 
  		var y = this.wallWeapPlayersCells[i] - x * this.board[0].length; 
		this.board[x][y].addClass('player ' + (spaceships[i - (this.numbWalls + this.numbWeapons)].cssClass) + " " + (spaceships[i - (this.numbWalls + this.numbWeapons)].currentWeapon.cssClass));
		spaceships[i - (this.numbWalls + this.numbWeapons)].position.x = x;
		spaceships[i - (this.numbWalls + this.numbWeapons)].position.y = y; 
		spaceships[i - (this.numbWalls + this.numbWeapons)].currentWeapon.position.x = x;
		spaceships[i - (this.numbWalls + this.numbWeapons)].currentWeapon.position.y = y;
		// console.log('PLAYERS: index[' + [i] + ']: ' + this.wallWeapPlayersCells[i]);
		// console.log('PLAYER CURRENT WEAPON POS: index[' + [i] + ']: ' + 
		//  spaceships[i - (this.numbWalls + this.numbWeapons)].currentWeapon.position.x + ", " 
		//  + spaceships[i - (this.numbWalls + this.numbWeapons)].currentWeapon.position.y);	
	}
};

/** Creating map object instance: PlayerMovement
=============================================================**/
map.prototype.PlayerMovement = function (index) {
	var highlightedCellsArr = [];
	var plPos = this.players[index].position;
	// document.getElementById("pl1Attack").style.visibility = "hidden";
	$("#pl1-Attack").hide();
	$("#pl1-Defend").hide();
	$("#pl2-Attack").hide();
	$("#pl2-Defend").hide();
	var pl1_Attack = document.getElementById('pl1-Attack');
	var pl2_Attack = document.getElementById('pl2-Attack');

	//UP highlights (vertical cells)
	for (var i = 1; i < 4; i++) {
		if (plPos.x-i >= 0) { //where x (row) index is equal or greater than 0, then add a class "accessible" to cell
			// if (this.board[plPos.x-i][plPos.y].hasClass("wall") || this.board[plPos.x-i][plPos.y].hasClass("player")) {
			if (this.board[plPos.x-i][plPos.y].hasClass("wall")) {
				break;
			}
			if (this.board[plPos.x-i][plPos.y].hasClass("player")) {
				console.log("Enemy on sight. Initiate attack, defence, or retrieve.");
				gameTimeline.innerHTML = "Enemy on sight. Initiate attack, defence, or retrieve";
				var self = this; 
				if (self.players[index].cssClass === "player1") {
					$("#pl1-Attack").show();
	 				$("#pl1-Defend").show();
					pl1_Attack.addEventListener("click", function() {
					    self.players[index].attack(player2);
					}, false);
				}
				if (self.players[index].cssClass === "player2") {
					$("#pl2-Attack").show();
	 				$("#pl2-Defend").show();
					pl2_Attack.addEventListener("click", function() {
					    self.players[index].attack(player1);
					}, false);
				}
				break;
			}
			if (this.board[plPos.x-i][plPos.y].hasClass("weapon") && !this.board[plPos.x-i][plPos.y].hasClass("wall") || !this.board[plPos.x-i][plPos.y].hasClass("player")) {
				this.board[plPos.x-i][plPos.y].addClass("accessible");
				highlightedCellsArr.push(this.board[plPos.x-i][plPos.y]);	 
			}	
		}
	}
	//DOWN highlights (vertical cells)
	for (var j = 1; j < 4; j++) {
		if (plPos.x+j < 9) { //this.board.length = 9 (0-8 index)
			if (this.board[plPos.x+j][plPos.y].hasClass("wall") || this.board[plPos.x+j][plPos.y].hasClass("player")) {
				break;
			}
			if (this.board[plPos.x+j][plPos.y].hasClass("weapon") && !this.board[plPos.x+j][plPos.y].hasClass("wall") || !this.board[plPos.x+j][plPos.y].hasClass("player")) {
				this.board[plPos.x+j][plPos.y].addClass("accessible");
				highlightedCellsArr.push(this.board[plPos.x+j][plPos.y]);	 
			}
		}
	}
	//LEFT highlights (horizontal cells)
	for (var i = 1; i < 4; i++) {
		if (plPos.y-i >= 0) { //where y (colloms) index is equals or greater than 0, then add a class "accessible" to cell
			if (this.board[plPos.x][plPos.y-i].hasClass("wall") || this.board[plPos.x][plPos.y-i].hasClass("player")) {
				break;
			}
			if (this.board[plPos.x][plPos.y-i].hasClass("weapon") && !this.board[plPos.x][plPos.y-i].hasClass("wall") || !this.board[plPos.x][plPos.y-i].hasClass("player")) {
				this.board[plPos.x][plPos.y-i].addClass("accessible");		
				highlightedCellsArr.push(this.board[plPos.x][plPos.y-i]);	 
			}
		}
	}
	//RIGHT highlights (horizontal cells)
	for (var i = 1; i < 4; i++) {
		if (plPos.y+i < 10) { //this.board[0].length = 10 (0-9 index)
			if (this.board[plPos.x][plPos.y+i].hasClass("wall") || this.board[plPos.x][plPos.y+i].hasClass("player")) {
				break;
			}
			if (this.board[plPos.x][plPos.y+i].hasClass("weapon") && !this.board[plPos.x][plPos.y+i].hasClass("wall") || !this.board[plPos.x][plPos.y+i].hasClass("player")) {
				this.board[plPos.x][plPos.y+i].addClass("accessible");
				highlightedCellsArr.push(this.board[plPos.x][plPos.y+i]);	 
			}
		}
	}


	for (var i = 0; i < highlightedCellsArr.length; i ++) {
		$(highlightedCellsArr[i]).bind('click', movePlayer); //bind(eventType, handler )
		//avoid using methods as callback functions!!!
	}


	/** Creating function handler, movePlayer()
	=============================================================**/
	var self = this; 
	function movePlayer(e) { 
        var plPos = self.players[index].position;
        var cWp = self.players[index].currentWeapon.position;
        var cWc = self.players[index].currentWeapon.cssClass;

        self.board[plPos.x][plPos.y].removeClass();
        console.log("previous player" + (index + 1) + " position: ", plPos);
        $(e.target).addClass('player player' + (index + 1));
       
        if ($(e.target).hasClass('accessible') && !$(e.target).hasClass('weapon')) {
            $(e.target).removeClass('accessible');  
            $(e.target).addClass(cWc); 
            console.log("newly added classes: " + cWc);
        }
        if ($(e.target).hasClass('accessible') && $(e.target).hasClass('weapon')) {
        	$(e.target).removeClass('accessible');
        	self.board[plPos.x][plPos.y].addClass(cWc);
        	console.log("currentWeapon class dropped: " + self.players[index].currentWeapon.cssClass);
        }
        
        var row = e.target.parentElement.rowIndex;
        var col = e.target.cellIndex;
        plPos.x = row; //plPos = self.players[index].position;
        plPos.y = col;
        console.log("new player" + (index + 1) + " position = ", plPos);

        for (var i = 0; i < self.weapons.length; i++) {
            if (self.players[index].position.x === self.weapons[i].position.x && 
                self.players[index].position.y === self.weapons[i].position.y) { 
                var weaponBuffer = self.players[index].currentWeapon; 
                self.players[index].currentWeapon = self.weapons[i]; 
                self.weapons[i] = weaponBuffer; //store old weapon in the "weapons" arr
                self.weapons[i].position = {x:row, y:col}; //dropped weapons position updated
                console.log(self.players[index].status());
                var plActivity = self.players[index].status();
                var gameTimeline = document.getElementById('timeline');
				gameTimeline.innerHTML = plActivity;
            }
            else {
            	console.log("Loop[" + i + "] - player vs weapon["+i+"] coordinates are not the same");
            }
        }
		//remove all event listeners with .bind()
		$('.accessible').unbind();
  		//remove highlights before next player's turn to move
  		for (var i = 0; i < highlightedCellsArr.length; i ++) {
			$(highlightedCellsArr[i]).removeClass('accessible');
		}

		var crrPlr = index;
		var nxtPlr = crrPlr;
		if (crrPlr === 0) {
			nxtPlr = 1;
		}
		else {
			nxtPlr = 0;
		}

		self.PlayerMovement(nxtPlr);	

	}//end of callback function, movePlayer()

};//end of callback function, PlayerMovement()



/** Instantiating constructor function, "map"
=============================================================**/
var gameMap = new map(9, 10, 12, 4); // console.log(gameMap);

gameMap.Board();
gameMap.Walls();
gameMap.Weapons();
gameMap.Players();
//make index (0/1) random 
var index = Math.floor(Math.random() * Math.floor(2));
gameMap.PlayerMovement(index);


/** New Game button
=============================================================**/
var newGame = document.getElementById('new-game');
newGame.onclick = function() {
	document.location.reload();
}


/** Game Results pop up window
=============================================================**/
var gameTimeline = document.getElementById('timeline');
var opacity = document.getElementById('opacity-layer');
var result_popUp = document.getElementById('result-popUp');
result_popUp.style.display = "none";
opacity.style.display = "none";
var winnerImg = document.getElementById('winner-img');
var winnerName = document.getElementById('winner-name');
var winnerPts = document.getElementById('winner-pts');
var popUp_newGame = document.getElementById('popUp-newGame-btn');
popUp_newGame.onclick = function() {
	window.location.reload();
}

var gameOver = false;

// setTimeout(function() {
// 	resultsCard();
// }, 600); //to be run inside an if statement

//popUp to appear in 5ms
// var myVar;
// function myFunction() {
//   myVar = setTimeout(function(){ resultsCard(); }, 600);
// }
// myFunction();
// //popUp to disappear 
// function myStopFunction() {
//   clearTimeout(myVar);
// }

function resultsCard() {
	// gameOver = false;
	var width = window.innerWidth;
	opacity.style.display = "block";
	result_popUp.style.display = "block";
	result_popUp.style.left = (width/2) - 500/2 + "px"; //result is a string - eg 500px
	result_popUp.style.top = 150 + "px";

	// $("#winner-img").attr("src","images/player1.png"); 
	winnerImg.src="images/player1.png";
	winnerImg.id="winner-img";

	winnerName.innerHTML = "PLAYERX";
	winnerPts.innerHTML = "20";
}

popUp_newGame.addEventListener('click', goAgain);
function goAgain() {
	result_popUp.style.display = "none";
	opacity.style.display = "none";
	// myStopFunction();
}
