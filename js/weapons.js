/** Creating the "weapon" class
===============================================**/
var weapon = {
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
	html.initWeapon("Markup", "HTML", "20", "weapon weapon-1"); 
	var css = Object.create(weapon);
	css.initWeapon("Markup", "CSS", "50", "weapon weapon-2");
	var js = Object.create(weapon);
	js.initWeapon("Scripting", "JS", "70", "weapon weapon-3");
	var cPlusPlus = Object.create(weapon);
	cPlusPlus.initWeapon("Object-Oriented", "C++", "90", "weapon weapon-4");

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
		this.board[x][y].addClass(this.weapons[i - this.numbWalls].cssClass);	
		this.weapons[i - this.numbWalls].position.x = x; 
		this.weapons[i - this.numbWalls].position.y = y;	
	}	
};

gameMap.weapons_();