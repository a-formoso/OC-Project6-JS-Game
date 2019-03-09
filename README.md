# JavaScript Game

## OpenClassrooms: Front-end Web Developer

### Project 6 - Build a turn-based board game in JavaScript

#### Project deliverables: 
* Randomly generate the game map 
* Randomly add 2 players, obstacles, and a maximum of 4 different weapons
* Game players (:space_invader: :alien:) shouldn't touch each other
* Game weapons can be of any type (e.g.: programming languages)
* Each weapon can inflict different damage points (default weapon must inflict 10 pts damage) 
* Game obstacles represent the unavailable (dimmed) boxes, players can't pass through these directly
* For each turn, a player can move from one to three boxes (horizontally or vertically)
* If a player passes over a box containing a weapon, they leave their current weapon on site and replace it with the new one
* If players cross over adjacent squares (horizontally or vertically), a battle begins
* During battle: each player attacks in turn
* During battle: the damage depends on the player's weapon
* During battle: the player can choose to attack or defend against the next shot
* During battle: if a player chooses to defend, they sustain 50% less damage than normal
* As soon as the life points of a player (initially 100) falls to 0, they lose. A message appears and the game is over.

#### By [*Alexandre Formoso*](http://aformoso.com)
January 2019


### Play the game [(https://alexandreformoso.github.io/OC-Project6-JS-Game/)]

![game printscreen](/images/game-preview.png)

### Example Code
```javascript

var Weapon = {
  initWeapon: function (type, name, damage, cssClass) {
    this.type = type;
    this.name = name;
    this.damage = damage;
    this.cssClass = cssClass;
    this.position = {x:0, y:0};
  }
}; 

/**********************************************************************
*  Creating Weapons
*********************************************************************/
map.prototype.Weapons = function() {
  var html = Object.create(Weapon);
  html.initWeapon("Markup", "HTML", "20", "weapon weapon-1");
  var css = Object.create(Weapon);
  css.initWeapon("Markup", "CSS", "50", "weapon weapon-2");
  var js = Object.create(Weapon);
  js.initWeapon("Scripting", "JS", "70", "weapon weapon-3");
  var cPlusPlus = Object.create(Weapon);
  cPlusPlus.initWeapon("Object-Oriented", "C++", "90", "weapon weapon-4");

  var badges = [html, css, js, cPlusPlus];
  this.weapons = badges;

  while(this.wallWeapPlayersCells.length < this.numbWalls + this.numbWeapons) { //while 12 < 16
    var tdNo = Math.ceil(Math.random()*(this.board[0].length*this.board.length) - 1);
    if(this.wallWeapPlayersCells.indexOf(tdNo) > -1) {
      continue;
    }
    this.wallWeapPlayersCells[this.wallWeapPlayersCells.length] = tdNo;
  }

  for (var i = this.numbWalls; i < this.wallWeapPlayersCells.length; i ++) {
    var x = Math.floor(this.wallWeapPlayersCells[i] / this.board[0].length); 
    var y = this.wallWeapPlayersCells[i] - x * this.board[0].length;
    this.board[x][y].addClass(this.weapons[i - this.numbWalls].cssClass);
    this.weapons[i - this.numbWalls].position.x = x;
    this.weapons[i - this.numbWalls].position.y = y;
  }
};
