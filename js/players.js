var gameTimeline = document.getElementById('timeline');

/** Creating the players' blueprint, "character"
===============================================**/
var character = { 
    initCharacter: function (name, health, cssClass) {
        this.name = name; //Axiom, Bilkis
        this.health = health;
		var defaultWeapon = Object.create(weapon);
		defaultWeapon.initWeapon("WebDev", "OPC", 10, "weapon weapon-0"); //type, name, damage, cssClass
        this.currentWeapon = defaultWeapon;
        this.cssClass = cssClass; //player1, player2
        this.position = {x:0, y:0};
        this.defence = {status: 'off'};
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
        //1 - if healthy, attack enemy
        if (this.health > 0) {
            var damage = this.currentWeapon.damage; 
            if (target.defence.status === "on") {
            	damage = damage/2; //inflict 50% damage
            	console.log("current weapon, " + this.currentWeapon.name + ", with damage of " + this.currentWeapon.damage + " pts reduced to 50% ("  + damage + ") damage");
            	target.health = target.health - damage;
            	console.log(this.name + " attacks " + target.name + " and inflicts " + damage + "(50%) pts damage");
            	gameTimeline.innerHTML = this.name + " attacks " + target.name + " and inflicts " + damage + "(50%) pts damage";
            	
        		target.defence.status = 'off'; 
            	console.log(this.cssClass + " sets " + target.cssClass + "'s defence to: " + target.defence.status);
            	gameTimeline.innerHTML = this.cssClass + " sets " + target.cssClass + "'s defence to: " + target.defence.status;
            } else {
            	target.health = target.health - damage; 
        		console.log(this.name + " attacks " + target.name + " and inflicts " + damage + " pts damage");
        		gameTimeline.innerHTML = this.name + " attacks " + target.name + " and inflicts " + damage + " pts damage";
        	}
        	//1.1 - evaluate enemy's health points
            if (target.health > 0) {
				console.log(target.info());
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
	player1 = Object.create(character);
	player1.initCharacter("Axiom", 100, "player1"); 
	player2 = Object.create(character);
	player2.initCharacter("Bilkis", 100, "player2");

	var spaceships = [player1, player2]; 
	this.players = spaceships;

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

gameMap.players_();