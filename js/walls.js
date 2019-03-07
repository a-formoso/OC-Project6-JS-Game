/** Creating Map object instance: walls (game obstacles)
=============================================================**/

Map.prototype.walls_ = function() {
	//randomly create 12 unique numbers 
	while(this.wallWeapPlayersCells.length < this.numbWalls) { //numbWalls = 12
    	var tdNo = Math.ceil(Math.random()*(this.board[0].length*this.board.length) - 1); 
    	if(this.wallWeapPlayersCells.indexOf(tdNo) > -1) continue; 
    	this.wallWeapPlayersCells[this.wallWeapPlayersCells.length] = tdNo;
    }
	//identify the x and y coordinates from Wall numbers created, add class 'wall'
	for (var i = 0; i < this.numbWalls; i ++) { 
  		var x = Math.floor(this.wallWeapPlayersCells[i] / this.board[0].length);
  		var y = this.wallWeapPlayersCells[i] - x * this.board[0].length; 
 		this.board[x][y].addClass('wall');  
		this.wallsPos.push({x: x, y: y});
	}
};

gameMap.walls_();
