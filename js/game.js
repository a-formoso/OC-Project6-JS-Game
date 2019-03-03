/************************
* TURN-BASED BOARD GAME
************************/

/** Creating Map object instance: board
=============================================================**/
Map.prototype.board_ = function() { //annonymous function is *assigned* to board_
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
}; //end of *function expression* (;)

/** Creating Map object instance: walls (game obstacles)
=============================================================**/
Map.prototype.walls_ = function() {
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

/** Creating the "weapon" class
===============================================**/
var weapon = {
  //initialise object prototype
  initWeapon: function (type, name, damage, cssClass) {
    this.type = type;
    this.name = name;
    this.damage = damage;
    this.cssClass = cssClass;
 	this.position = {x:0, y:0};
  }
}; 

/** Creating Map object instance: weapons_
=============================================================**/
Map.prototype.weapons_ = function() {
	var html = Object.create(weapon);
	html.initWeapon("Markup", "HTML", "20", "weapon weapon-1"); //type, name, damage, cssClass
	var css = Object.create(weapon);
	css.initWeapon("Markup", "CSS", "50", "weapon weapon-2");
	var js = Object.create(weapon);
	js.initWeapon("Scripting", "JS", "70", "weapon weapon-3");
	var cPlusPlus = Object.create(weapon);
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

var gameTimeline = document.getElementById('timeline');

/** Creating the players' blueprint, "character"
===============================================**/
var character = { 
    //players_ will inherit properties from characternbz 
    initCharacter: function (name, health, cssClass) {
        this.name = name; //Axiom, Bilkis
        this.health = health;
		var defaultWeapon = Object.create(weapon);
		defaultWeapon.initWeapon("WebDev", "OPC", 10, "weapon weapon-0"); //type, name, damage, cssClass
        this.currentWeapon = defaultWeapon;
        this.cssClass = cssClass; //player1, player2
        this.position = {x:0, y:0};
        this.defence = {status: 'off'}; //update by reference
        this.isLifeTaken = {status: null}
    },
	info: function () {
	    var description = this.name + " has " + this.health + " health points and " +
	        this.currentWeapon.damage + " (" + this.currentWeapon.name + ") weapon pts";
	    return description;
	},
	status: function () {
		var describe = this.name + " picks up new weapon, " + this.currentWeapon.name + ". " + 
		this.name + " can now inflict " + this.currentWeapon.damage + " pts damage";
		return describe;
	},
	healthCheck: function() {
		var des = this.name + " is unable to continue \n (they've been eliminated)";
		gameTimeline.innerHTML = this.name + " is unable to continue (they've been eliminated)";
		return des;		
	},
    attack: function (target) {
        //1 - if healthy, attack enemy!
        if (this.health > 0) {
            var damage = this.currentWeapon.damage; //use arrays instead
            if (target.defence.status === "on") {
            	damage = damage/2; //inflict 50% weapon damage
            	console.log("current weapon, " + this.currentWeapon.name + ", with damage of " + this.currentWeapon.damage + " pts reduced to 50% ("  + damage + ") damage");
            	target.health = target.health - damage;
            	console.log(this.name + " attacks " + target.name + " and inflicts " + damage + "(50%) pts damage");
            	gameTimeline.innerHTML = this.name + " attacks " + target.name + " and inflicts " + damage + "(50%) pts damage";
            	
        		target.defence.status = 'off'; //set target player's defence status to 'off'
            	console.log(this.cssClass + " sets " + target.cssClass + "'s defence to: " + target.defence.status);
            	gameTimeline.innerHTML = this.cssClass + " sets " + target.cssClass + "'s defence to: " + target.defence.status;
            } else {
            	target.health = target.health - damage; //inflict 100% weapon damage
        		console.log(this.name + " attacks " + target.name + " and inflicts " + damage + " pts damage");
        		gameTimeline.innerHTML = this.name + " attacks " + target.name + " and inflicts " + damage + " pts damage";
        	}
        	//1.1 - evaluating enemy's health points
            if (target.health > 0) {
				console.log(target.info()); //player info
				gameTimeline.innerHTML = target.info();
            }
            else {
            	target.health = 0;
            	console.log(target.name + " has " + target.health + " pts remaining");

				var answer = new Boolean(true);
				target.isLifeTaken.status = answer;
				console.log("isLifeTaken = " + target.isLifeTaken.status); 

            	resultsCardWinnerImg = this.cssClass;
        		resultsCardWinnerPts = this.health;
        		resultsCardWinnerName = this.name;
            	// setTimeout(gameResult, 800); //setTimeout(callback, delay)
            }
            if (target.cssClass === "player1") {
            	document.getElementById('pl1-health-pts').innerHTML = target.health;
            	// if (target.health > 0 && target.health <= 50) {
            	if (target.health <= 50) {
					document.getElementById('pl1-health-pts').style.color = "orange";
				}
            	if (target.health >= 0 && target.health <= 20) {
					document.getElementById('pl1-health-pts').style.color = "red";
				}
            }
            else if (target.cssClass === "player2") {
            	document.getElementById('pl2-health-pts').innerHTML = target.health;
            	if (target.health <= 50) {
					document.getElementById('pl2-health-pts').style.color = "orange";
				}
            	if (target.health >= 0 && target.health <= 20) {
					document.getElementById('pl2-health-pts').style.color = "red";
				}
            }  
        }
	},
	defend: function () {
		this.defence.status = 'on';
	    console.log(this.cssClass + " chooses to defend. Defence status set to: " + this.defence.status);
	    gameTimeline.innerHTML = this.cssClass + " chooses to defend. Defence status set to: " + this.defence.status;
	}
};

/** Creating Map object instance: players_
=============================================================**/
Map.prototype.players_ = function() {
	//player1 and player2 as global variabes
	player1 = Object.create(character);
	player1.initCharacter("Axiom", 100, "player1"); 
	player2 = Object.create(character);
	player2.initCharacter("Bilkis", 100, "player2");
	//adding players to the blueprint
	var spaceships = [player1, player2]; 
	this.players = spaceships;
	//randomly create 2 unique values
	while (this.wallWeapPlayersCells.length < this.numbWalls + this.numbWeapons + spaceships.length) {
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
	}
};


/** Creating Map object instance: playerMovement_
=============================================================**/
Map.prototype.playerMovement_ = function (index) {
	if (this.players[index].health <= 0) { 
		console.log(this.players[index].healthCheck());
		// document.getElementById('new-game').removeAttribute('disable');
        return setTimeout(gameResult, 800); //setTimeout(callback, delay)
	} else {
		var enemyOnSight = function() {
			console.log("Enemy on sight. Initiate attack or defend");
			gameTimeline.innerHTML = "Enemy on sight. Initiate attack or defend";
			$( "button.accessible" ).show(); //show attack, defend btns
			// document.getElementById('new-game').setAttribute('disable', 'true');
		}
	} 
	var highlightedCellsArr = [];
	var gameTimeline = document.getElementById('timeline');
	var plPos = this.players[index].position; //property access: bracket notation. index value being called on the object
	var nxtPlTurn = function() {
		//remove all jQuery event handlers from all elems
		$('*').unbind(); 
		//remove all (movement) hightlights 
  		for (var j = 0; j < highlightedCellsArr.length; j++) {
			$(highlightedCellsArr[j]).removeClass('accessible');
		}
		//call next player's turn
		var crrPlr = index; //0 or 1
		var nxtPlr = crrPlr;
		if (crrPlr === 0) {
			nxtPlr = 1;
		}
		else {
			nxtPlr = 0;
		}
		self.playerMovement_(nxtPlr);
	}
	$( "button.accessible" ).hide(); //hide both attack and defend btns

	//UPPER highlights (vertical movement)
	for (var a = 1; a < 4; a++) {
		if (plPos.x-a >= 0) { //where x (row) index is equal or greater than 0, then add a class "accessible" to cell
			if (this.board[plPos.x-a][plPos.y].hasClass("wall")) {
				break;
			}
			if (this.board[plPos.x-a][plPos.y].hasClass("player")) {
				enemyOnSight();
				break;
			}
			if (this.board[plPos.x-a][plPos.y].hasClass("weapon") && !this.board[plPos.x-a][plPos.y].hasClass("wall") || !this.board[plPos.x-a][plPos.y].hasClass("player")) {
				this.board[plPos.x-a][plPos.y].addClass("accessible");
				highlightedCellsArr.push(this.board[plPos.x-a][plPos.y]);	 
			}	
		}
	}
	//LOWER highlights (vertical movement)
	for (var e = 1; e < 4; e++) {
		if (plPos.x+e < 9) { //this.board.length = 9 (0-8 index)
			if (this.board[plPos.x+e][plPos.y].hasClass("wall")) {
				break;
			}
			if (this.board[plPos.x+e][plPos.y].hasClass("player")) {
				enemyOnSight();
				break;
			}
			if (this.board[plPos.x+e][plPos.y].hasClass("weapon") && !this.board[plPos.x+e][plPos.y].hasClass("wall") || !this.board[plPos.x+e][plPos.y].hasClass("player")) {
				this.board[plPos.x+e][plPos.y].addClass("accessible");
				highlightedCellsArr.push(this.board[plPos.x+e][plPos.y]);	 
			}
		}
	}
	//LEFT highlights (horizontal movement)
	for (var i = 1; i < 4; i++) {
		if (plPos.y-i >= 0) { 
			if (this.board[plPos.x][plPos.y-i].hasClass("wall")) {
				break;
			}
			if (this.board[plPos.x][plPos.y-i].hasClass("player")) {
				enemyOnSight();
				break;
			}
			if (this.board[plPos.x][plPos.y-i].hasClass("weapon") && !this.board[plPos.x][plPos.y-i].hasClass("wall") || !this.board[plPos.x][plPos.y-i].hasClass("player")) {
				this.board[plPos.x][plPos.y-i].addClass("accessible");		
				highlightedCellsArr.push(this.board[plPos.x][plPos.y-i]);	 
			}
		}
	}
	//RIGHT highlights (horizontal movement)
	for (var o = 1; o < 4; o++) {
		if (plPos.y+o < 10) {
			if (this.board[plPos.x][plPos.y+o].hasClass("wall")) {
				break;
			}
			if (this.board[plPos.x][plPos.y+o].hasClass("player")) {
				enemyOnSight();
				break;
			}
			if (this.board[plPos.x][plPos.y+o].hasClass("weapon") && !this.board[plPos.x][plPos.y+o].hasClass("wall") || !this.board[plPos.x][plPos.y+o].hasClass("player")) {
				this.board[plPos.x][plPos.y+o].addClass("accessible");
				highlightedCellsArr.push(this.board[plPos.x][plPos.y+o]);	 
			}
		}
	}


	$(".accessible").bind('click', movePlayer);


	/** Creating function handler, movePlayer()
	=============================================================**/
	var self = this; //changing this
	function movePlayer(e) { //hoisted to the top of the context (local scope)
		var attack_Btn = document.getElementById('attack-btn');
		var defend_Btn = document.getElementById('defend-btn');
		if ($(e.target).is("button.pl-attack-btn")) {
            	if (self.players[index].cssClass === "player1") {
                	self.players[index].attack(player2);
                } if (self.players[index].cssClass === "player2") {
                	self.players[index].attack(player1);
                }	
        }
        if ($(e.target).is("button.pl-defend-btn")) {
                self.players[index].defend();
        }
        if ($(e.target).is("td.accessible")) {
  
	        var plPos = self.players[index].position;
	        var cWp = self.players[index].currentWeapon.position;
	        var cWc = self.players[index].currentWeapon.cssClass;

	        self.board[plPos.x][plPos.y].removeClass();
	        console.log("previous player" + (index + 1) + " position: ", plPos);
	        // $(e.target).addClass('player player' + (index + 1)); //addClass
	        e.target.classList.add('player', 'player' + (index + 1));

	        if ($(e.target).hasClass('accessible') && !$(e.target).hasClass('weapon')) {
	            $(e.target).removeClass('accessible'); //removeClass
	            $(e.target).addClass(cWc); 
	            console.log("newly added classes: " + cWc);

	            var row = e.target.parentElement.rowIndex;
		        var col = e.target.cellIndex;
		        plPos.x = row; //plPos = self.players[index].position;
		        plPos.y = col;
		        console.log("new player" + (index + 1) + " position = ", plPos);

		        cWp.x = plPos.x;
		        cWp.y = plPos.y;
		        console.log("new weapon position = ", cWp);
	        }
	        else { 
	        	$(e.target).removeClass('accessible'); 
	        	self.board[plPos.x][plPos.y].addClass(cWc);
	        	console.log("currentWeapon class dropped: " + self.players[index].currentWeapon.cssClass);
	        
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
		                console.log(self.players[index].status());
		                var plActivity = self.players[index].status();
						gameTimeline.innerHTML = plActivity;
		            }
		        }
	   		}
   		}
   		//unbind, remove hightlights, call next player's turn
		nxtPlTurn();
	}//end of callback function, movePlayer()
	
};//end of PlayerMovement_()


/** Creating blueprint, Map, via constructor function
=============================================================**/
function Map(nRows, nColumns, nWalls, nWeapons) { //hoisted to the top of the context (global scope)
	this.x = nRows;
	this.y = nColumns;
	this.numbWalls = nWalls; 
	this.numbWeapons = nWeapons; 

	this.board = []; 
	this.wallWeapPlayersCells = []; //for 2D ref
	this.wallsPos = []; 
	this.weapons = []; 
	this.players = [];
} //end of *function declaration*


/** Instantiating constructor function, "Map"
=============================================================**/
var gameMap = new Map(9, 10, 12, 4); //variable gameMap holds the pointer (ref) to the location in memory where Map exists
console.log(gameMap);
var index = Math.floor(Math.random() * Math.floor(2)); //make index (0/1) random 
gameMap.board_();
gameMap.walls_();
gameMap.weapons_();
gameMap.players_();
gameMap.playerMovement_(index);


/** Game Rules card
=============================================================**/
//displaying Game Rules on page load
$(document).ready(function () {
    $("#welcome-card").show();
});
//Hiding Game Rules when user clicks to "Start" the game
var start_game = document.getElementById('start-game');
start_game.addEventListener('click', () => {
	document.getElementById('welcome-card').style.display = "none";
});


/** New Game button
=============================================================**/
var newGame = document.getElementById('new-game');
newGame.onclick = ($e) => {
	document.location.reload(); //we are just refreshing the browser, the ideal is to re-start the game
	$e.preventDefault();
	// $(".game-outer-container").load("new-game.html");
}

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
resultsCard_Btn.addEventListener('click', () => { //arrow function as a callback
	resultsCard.style.display = "none";
	opacityLayer.style.display = "none";
});
// gameResult();
