/** Creating Map object instance: board
=============================================================**/

Map.prototype.board_ = function() { 
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
		this.board.push(row);
	}
};

gameMap.board_();
