// Tile class
function Tile (position, value) {
	this.row = position.row;
	this.col = position.col;
	this.value = value || 2;

	// for animation 
	// mergedFrom saves the other tile's position which has merged to the tile.
	this.previousPosition	= null;
	this.mergedFrom			= null;
}

Tile.prototype.getPosition = function () {
	return { row: this.row, col: this.col};
};

Tile.prototype.savePosition = function () {
	this.previousPosition = { row: this.row, col: this.col};
};

Tile.prototype.updatePostion = function (position) {
	this.row = position.row;
	this.col = position.col;
};

Tile.prototype.serialize = function () {
	return {
		position: {
			row: this.row,
			col: this.col
		},
		value: this.value
	};
};

