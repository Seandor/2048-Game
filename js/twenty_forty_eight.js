function TwentyFortyEight (size) {
	// width and height is measured by tile
	this.boardWidth 	= size.width;
	this.boardHeight 	= size.height;
	this.startTiles 	= 2;
	this.reset();
}

TwentyFortyEight.prototype.reset = function () {
	this.grid 	= new Grid(this.boardWidth, this.boardHeight);
	this.score 	= 0;
	this.won	= false;
	this.addStartTiles();
};

TwentyFortyEight.prototype.getBoardWidth = function () {
	return this.boardWidth;
};

TwentyFortyEight.prototype.getBoardHeight = function () {
	return this.boardHeight;
};

TwentyFortyEight.prototype.addStartTiles = function () {
	for (var i = 0; i < this.startTiles; i++) {
		this.newTile();
	}
};

// Randomly choose a grid cell 
// assign it a number to be a tile
TwentyFortyEight.prototype.newTile = function () {
	var position = this.grid.randomAvailableCells();
	var value = Math.random() < 0.9 ? 2 : 4;
	var tile = new Tile(position, value);
	this.grid.setTile(tile);
};

TwentyFortyEight.prototype.getVector = function (direction) {
	// 0: UP 1: RIGHT 2: DOWN 3: LEFT
	var OFFSETS = {
		0: {row: 1, col: 0},
		1: {row: 0, col: -1},
		2: {row: -1, col: 0},
		3: {row: 0, col: 1},
	};
	return OFFSETS[direction];
};

// move tiles in a specific direction
TwentyFortyEight.prototype.move = function (direction) {
	//
};

TwentyFortyEight.prototype.serialize = function () {
	return this.grid.serialize();
};

function testGame() {
	var size = {width: 4, height: 4};
	var game = new TwentyFortyEight(size);
	console.log(game.serialize());
}