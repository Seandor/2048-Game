// Tile class
function Tile (position, value) {
	this.row = position.row;
	this.col = position.col;
	this.value = value || 2;
}

Tile.prototype.serialize = function () {
	return {
		position: {
			row: this.row,
			col: this.col
		},
		value: this.value
	};
};

Tile.prototype.getValue = function () {
	return this.value;
};