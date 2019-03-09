/** Creating Map object instance: playerMovement_
=============================================================**/
Map.prototype.playerMovement_ = function (index) {
	if (this.players[index].health <= 0) { 
		console.log(this.players[index].healthCheck());
        return setTimeout(gameResult, 800);
	} else {
		var enemyOnSight = function() {
			console.log("Enemy on sight. Initiate attack or defend");
			gameTimeline.innerHTML = "Enemy on sight. Initiate attack or defend";
			// $("button.accessible").show(); //400ms default
			$("button.accessible").fadeIn(600); 

		}
	} 
	var highlightedCellsArr = [];
	var gameTimeline = document.getElementById('timeline');
	var plPos = this.players[index].position;
	var nxtPlTurn = function() {
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
	$("button.accessible").hide(); //hide both attack and defend btns

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
	var self = this; 
	function movePlayer(e) {
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
	        e.target.classList.add('player', 'player' + (index + 1));

	        if ($(e.target).hasClass('accessible') && !$(e.target).hasClass('weapon')) {
	            $(e.target).removeClass('accessible'); 
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
		        plPos.x = row; 
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

var index = Math.floor(Math.random() * Math.floor(2)); //make index (0/1) random 
gameMap.playerMovement_(index);