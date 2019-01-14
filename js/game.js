					/**********************************************************************
					* 						TURN-BASED BOAR GAME
					*********************************************************************/
"use strict"; //strict mode active 
//prevents sintax errors, use of reserved key words, deleting variables or functions, local variables being used globally,

/**********************************************************************
* Creating the map "class" via a constructor function
*********************************************************************/
function map(nRows, nColumns, nWalls, nWeapons) { //assigned arguments: 9, 10, 12, 4
	this.x = nRows;
	this.y = nColumns;
	this.numbWalls = nWalls; 
	this.numbWeapons = nWeapons; 

	this.board = []; //game board (stores dynamically created tds from createBoard() function)
	this.wallWeapPlayersCells = []; //stores random numbers for 2D ref
	this.wallsPos = []; //walls positions
	this.weapons = []; //colectable Weapons
	this.players = []; //players
	// this.highlighted = []; //players' movement options
}

/**********************************************************************
* map object instance: (DOM) game board
*********************************************************************/
map.prototype.Board = function() { //with keyword "prototype" we assign createBoard() function to the map object prototype
	//Creating DOM elements tr's, td's (cells)
	for (var i = 0; i < this.x; i++) { //9 rows
		var row = [];
		var tr = $('<tr></tr>');
		$('#grid').append(tr);
		//create 10 td's for each tr
		for (var j = 0; j < this.y; j++) { //10 cells
			var td = $('<td></td>');
	    	row.push(td); //array.push(elem1, elem2..) eg: var items = ['item1', 'item2']; items.push('item3');
	    	tr.append(td);
		}
		this.board.push(row); //.push() adds items to the end of an array, .unshift() adds to the beginning
	}
};

/**********************************************************************
* map object instance: Walls (game obstacles)
*********************************************************************/
map.prototype.Walls = function() {
	//for the 12 walls, randomly create 12 unique numbers 
	while(this.wallWeapPlayersCells.length < this.numbWalls) { //numbWalls = 12, wallWeapPlayersCells.length = 0-11 (< operator)
    	var tdNo = Math.ceil(Math.random()*(this.board[0].length*this.board.length) - 1); //tdNo ranges between 0-89 (Math.random()*(10*9 = 90-1)
    	//in wallWeapPlayersCells[] array, search for occurrences of tdNo, -1 if tdNo is not present
    	if(this.wallWeapPlayersCells.indexOf(tdNo) > -1) continue; //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
    	this.wallWeapPlayersCells[this.wallWeapPlayersCells.length] = tdNo; //OR this.wallWeapPlayersCells.push(tdNo);
    }
	//identify the x and y coordinates from Wall numbers created, give them a class of 'wall'
	for (var i = 0; i < this.numbWalls; i ++) { 
  		var x = Math.floor(this.wallWeapPlayersCells[i] / this.board[0].length); //eg: 65/10 = 6.5, Math.floor(6.5) = 6 //x=6
  		var y = this.wallWeapPlayersCells[i] - x * this.board[0].length; //65-6*10 (multiplication first) //y=5 
 		//using JQuery, apply CSS class "wall" to DOM nodes in board[] array
 		this.board[x][y].addClass('wall');  
		//"this.wallsPos" stores Walls' positions on the board and is a property of the "map" object
		this.wallsPos.push({x: x, y: y});	//index[key: property]
		//console.log('WALLS: index[' + [i] + ']: ' + this.wallWeapPlayersCells[i]);	
	}
};

/**********************************************************************
*  map object instance: Weapons
*********************************************************************/
//Creating the Weapon "class"
var Weapon = {
  //initialise object prototype
  initWeapon: function (type, name, damage, cssClass) {
    this.type = type;
    this.name = name;
    this.damage = damage;
    this.cssClass = cssClass;
 	this.position = {x:0, y:0};
  }
  //describe the weapon
  // describe: function () {
  //   var dscp = "Weapon " + this.name + " of type " + this.type + " is found, damage of " + this.damage + "pts can be caused on enemy.";
  //   return dscp;
  // }
}; 
//Creating Weapons
map.prototype.Weapons = function() {
	//The 4 weapons
	var html = Object.create(Weapon);
	html.initWeapon("Markup", "HTML", "20", "weapon weapon-1"); //(type, name, damage, cssClass)
	var css = Object.create(Weapon);
	css.initWeapon("Markup", "CSS", "50", "weapon weapon-2");
	var js = Object.create(Weapon);
	js.initWeapon("Scripting", "JS", "70", "weapon weapon-3");//(type, name, damage, cssClass)
	var cPlusPlus = Object.create(Weapon);
	cPlusPlus.initWeapon("Object-Oriented", "C++", "90", "weapon weapon-4");

	var badges = [html, css, js, cPlusPlus]; //store the weapons' array in our "map" class
	this.weapons = badges;

	//randomly create 4 new unique values, store them in this.wallWeapPlayersCells[]
	while(this.wallWeapPlayersCells.length < this.numbWalls + this.numbWeapons) { //while 12 < 16
		var tdNo = Math.ceil(Math.random()*(this.board[0].length*this.board.length) - 1);
		if(this.wallWeapPlayersCells.indexOf(tdNo) > -1) { 
			continue; 
		} 		
		this.wallWeapPlayersCells[this.wallWeapPlayersCells.length] = tdNo;
	}
	//identify x and y coordinates, place weapons on the map using both the coordinates and css classes
	for (var i = this.numbWalls; i < this.wallWeapPlayersCells.length; i ++) { //while 12 < 16
  		var x = Math.floor(this.wallWeapPlayersCells[i] / this.board[0].length); 
  		var y = this.wallWeapPlayersCells[i] - x * this.board[0].length; //multiplication first
		this.board[x][y].addClass(this.weapons[i - this.numbWalls].cssClass);	//i=12-12, i++ //weapons[0].cssClass - line 57
		this.weapons[i - this.numbWalls].position.x = x; //ref to var "weapons" above
		this.weapons[i - this.numbWalls].position.y = y; //updating "weapons" position
		//console.log('WEAPONS: index[' + [i] + ']: ' + this.wallWeapPlayersCells[i]);	
	}	
};

/**********************************************************************
* map object instance: Players
*********************************************************************/
//Creating the players "class"
var Character = {
    //Initialise character
    initCharacter: function (name, health, cssClass) {
        this.name = name; //eg: "Axiom"
        this.health = health;
		var defaultWeapon = Object.create(Weapon);
		defaultWeapon.initWeapon("WebDev", "OPC", 10, "weapon weapon-0"); //(type, name, damage, cssClass)
        this.currentWeapon = defaultWeapon;
        this.cssClass = cssClass; //eg: "player1"
        this.position = {x:0, y:0};
        // this.currentWeapon.position = this.position;
    },
    //Character Describe property
	info: function () {
	    var description = this.name + " has " + this.health + " health points and " +
	        // this.currentWeapon.damage + " weapon points (" + this.currentWeapon.name + " weapon), position: " + this.currentWeapon.position.x + this.currentWeapon.position.y;
	        this.currentWeapon.damage + " (" + this.currentWeapon.name + ") weapon points";
	    return description;
	},
	status: function () {
		var describe = this.name + " picks up new weapon: " + this.currentWeapon.name + ". " + 
		this.name + " can now inflict " + this.currentWeapon.damage + " pts damage";
		return describe;
	},
    //Attack a target
    attack: function (target) {
        if (this.health > 0) {
            var damage = this.currentWeapon.damage;
            console.log(this.name + " attacks " + target.name + " and inflicts " + damage + " damage pts");
            target.health = target.health - damage;
            if (target.health > 0) {
                console.log(target.name + " has " + target.health + " health points left");
            } 
            else {
                target.health = 0;
                console.log(target.name + " has been eliminated!");
            }
        } 
        else {
            console.log(this.name + " can't attack (they've been eliminated).");
        }
    }
};
//Creating 2 Player(s) 
map.prototype.Players = function() {
	//player1 and player2 are global variabes
	var player1 = Object.create(Character);
	player1.initCharacter("Axiom", 100, "player1"); //passing arguments to property initCharacter()
	var player2 = Object.create(Character);
	player2.initCharacter("Bilkis", 100, "player2"); //(name, health, cssClass)

	var spaceships = [player1, player2]; //players array
	this.players = spaceships;

	//randomly create unique values for 2 players (players.length equals 2 and refers to the array above)
	while(this.wallWeapPlayersCells.length < this.numbWalls + this.numbWeapons + spaceships.length) {
		var tdNo = Math.ceil(Math.random()*(this.board[0].length*this.board.length) - 1);
		if(this.wallWeapPlayersCells.indexOf(tdNo) > -1) { 
			continue; 
		} 		
		this.wallWeapPlayersCells[this.wallWeapPlayersCells.length] = tdNo;
	}
	//identify x and y coordinates, give them a class of 'weapon-wrapper'
	for (var i = this.numbWalls + this.numbWeapons; i < this.wallWeapPlayersCells.length; i ++) { //i = 16; i < 18; i++
  		var x = Math.floor(this.wallWeapPlayersCells[i] / this.board[0].length); 
  		var y = this.wallWeapPlayersCells[i] - x * this.board[0].length; //multiplication first
		// this.board[x][y].addClass('player ' + (spaceships[i - (this.numbWalls + this.numbWeapons)].cssClass));
		this.board[x][y].addClass('player ' + (spaceships[i - (this.numbWalls + this.numbWeapons)].cssClass) + " " + (spaceships[i - (this.numbWalls + this.numbWeapons)].currentWeapon.cssClass));
		spaceships[i - (this.numbWalls + this.numbWeapons)].position.x = x; //players[0] //updates the x value in line 118
		spaceships[i - (this.numbWalls + this.numbWeapons)].position.y = y; //players[1] //updates the y value in line 118
		spaceships[i - (this.numbWalls + this.numbWeapons)].currentWeapon.position.x = x;
		spaceships[i - (this.numbWalls + this.numbWeapons)].currentWeapon.position.y = y;
		console.log('PLAYERS: index[' + [i] + ']: ' + this.wallWeapPlayersCells[i]);
		console.log('PLAYER CURRENT WEAPON POS: index[' + [i] + ']: ' + 
		 spaceships[i - (this.numbWalls + this.numbWeapons)].currentWeapon.position.x + ", " 
		 + spaceships[i - (this.numbWalls + this.numbWeapons)].currentWeapon.position.y);	
	}

	// console.log("Welcome to the adventure! Here are our heros:");
	// console.log(player1.describe());
	// console.log(player2.describe());
};

/**********************************************************************
* map object instance: Players' movement
*********************************************************************/
map.prototype.PlayerMovement = function (index) {
	"use strict"; 
	//Creating cell highlights for players to move
	var highlightedCellsArr = [];
	//get player position by accessing its coordinates
	var plPos = this.players[index].position;
	
	//UP highlights (vertical cells)
	for (var i = 1; i < 4; i++) {
		if (plPos.x-i >= 0) { //where x (row) index is equal or greater than 0, then add a class "accessible" to cell
			if (this.board[plPos.x-i][plPos.y].hasClass("wall") || this.board[plPos.x-i][plPos.y].hasClass("player")) {
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
	 	// highlightedCellsArr[i].click(movePlayer);
		$(highlightedCellsArr[i]).bind('click', movePlayer); //bind(eventType [, eventData ], handler )

		//avoid using methods as callback functions!!!
	}

	//function handler, movePlayer()
	var self = this; //"self" or "that" (var that = this;) are not special, 
	//they are simple variables that reference to map object (global scope)
	function movePlayer(e) { 
        var plPos = self.players[index].position;
        var cWp = self.players[index].currentWeapon.position; //cWp (currentWeaponPosition)
        var cWc = self.players[index].currentWeapon.cssClass;
        // self.board[plPos.x][plPos.y].removeClass('player player' + (index + 1));
        self.board[plPos.x][plPos.y].removeClass();
        console.log("previous player" + (index + 1) + " position: ", plPos);
 
        // self.board[cWp.x][cWp.y].removeClass(function(index, css) { //cWc (currentWeaponClass)
        //     return (css.match(/(^|\s)weap\S+/g) || []).join(' ');
        // });

        $(e.target).addClass('player player' + (index + 1));
       
        
        if ($(e.target).hasClass('accessible') && !$(e.target).hasClass('weapon')) {
            $(e.target).removeClass('accessible');  
            $(e.target).addClass(cWc); //cWc (currentWeaponClass)
            console.log("newly added classes: " + cWc);
        }
        
        if ($(e.target).hasClass('accessible') && $(e.target).hasClass('weapon')) {
        	$(e.target).removeClass('accessible');
        	self.board[plPos.x][plPos.y].addClass(cWc);
        	console.log("currentWeapon class dropped: " + self.players[index].currentWeapon.cssClass);
        }
        
        var row = e.target.parentElement.rowIndex;
        var col = e.target.cellIndex;
        plPos.x = row; //var plPos = self.players[index].position;
        plPos.y = col;
        console.log("new player" + (index + 1) + " position = ", plPos);

        for (var i = 0; i < self.weapons.length; i++) {
         
            if (self.players[index].position.x === self.weapons[i].position.x &&  //Equality (==) checks for equality of values; 
                self.players[index].position.y === self.weapons[i].position.y) { //Strict equality (===) checks for both type and value
                
                var weaponBuffer = self.players[index].currentWeapon; 
        
                self.players[index].currentWeapon = self.weapons[i]; 
                self.weapons[i] = weaponBuffer; //store old weapon in the "weapons" arr
                self.weapons[i].position = {x:row, y:col}; //dropped weapons position updated
                // $(e.target).addClass('weapon ' + self.weapons[i].cssClass);

                console.log(self.players[index].status());
                var plActivity = self.players[index].status();
                var gameTimeline = document.getElementById('timeline');
				gameTimeline.innerHTML = plActivity;

				// break;
            }
            else {
            	console.log("Loop[" + i + "] - player vs weapon["+i+"] coordinates are not the same");
            }
        }

		//remove all event listeners with .bind() (from every "acessible" cells (highlightedCellsArr array))
		$('.accessible').unbind();
  		//remove all the "accessible" classes (or highlights)
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

};

//instantiating constructor function "map"
var gameMap = new map(9, 10, 12, 4);
gameMap.Board();
gameMap.Walls();
gameMap.Weapons();
gameMap.Players();
//make index (0/1) to be random - player to move first selected randomnly
var index = Math.floor(Math.random() * Math.floor(2));
console.log("index = " + index);
gameMap.PlayerMovement(index);

console.log(gameMap);


//handling attack click events using anonymous functions
var gameTimeline = document.getElementById('timeline');

var pl1Attack = document.getElementById('pl1Attack');
pl1Attack.onclick = function() {
	gameTimeline.innerHTML = "Hello, player no 1 !";
}
var pl2Attack = document.getElementById('pl2Attack');
pl2Attack.onclick = function() {
	gameTimeline.innerHTML = "Hello, player no 2 !";
}

// function myFunction() {
//     gameTimeline.innerHTML = "Hello world!";
// }