/*
Grid util.
Position is represented in a Object like:
{
	row: row,
	col: col
}
*/
function Grid(gridWidth, gridHeight) {
	this.gridWidth = gridWidth;
	this.gridHeight = gridHeight;
	this.cells = this.init();
}

// this.cells is just a 2-D Array
Grid.prototype.init = function () {
	var row, idx, jdx;
	var cells = [];
	for (idx = 0; idx < this.gridHeight; idx++) {
		row = [];
		for (jdx = 0; jdx < this.gridWidth; jdx++) {
			row[jdx] = null;
		}
		cells[idx] = row;
	}
	return cells;
};

Grid.prototype.getWidth = function () {
	return this.gridWidth;
};

Grid.prototype.getHeight = function () {
	return this.gridHeight;
};

// Given a direction vector and start cell to traverse the grid
// return a list of tiles
Grid.prototype.traverseAndSetTile = function(startPos, directionVector, numSteps, mergedLine) {
	// 0: UP 1: RIGHT 2: DOWN 3: LEFT
	var row, col;
	var traversal = [];
	var position;
	for ( var i = 0; i < numSteps; i++ ) {
		row = startPos.row + i * directionVector.row;
		col = startPos.col + i * directionVector.col;
		if (mergedLine === undefined) {
			// only traverse
			traversal.push(this.cells[row][col]);
		} else {
			// set tile
			if (mergedLine[i] !== null) {
				position = {row: row, col: col};
				mergedLine[i].savePosition();
				mergedLine[i].updatePostion(position);
				this.setTile(mergedLine[i]);
			} else {
				this.cells[row][col] = null;
			}
		}
	}
	return traversal;
};

// Find an available random cell position
Grid.prototype.randomAvailableCells = function () {
	var cells = this.availableCells();
	if (cells.length) {
		return cells[Math.floor(Math.random() * cells.length)];
	}
};

// Return a list of available cell index
Grid.prototype.availableCells = function () {
	var cells = [];
	this.eachCell( function (row, col, tile) {
		if (tile === null) {
			cells.push({row: row, col: col});
		}
	});
	return cells;
};

// Return true if there is cell available
Grid.prototype.cellsAvailable = function () {
	for (var row = 0; row < this.gridHeight; row++) {
		for (var col = 0; col < this.gridWidth; col++) {
			if (!this.cells[row][col]) {
				return true;
			}
		}
	}
};

// iteration of the grid 
Grid.prototype.eachCell = function (callback) {
	for (var row = 0; row < this.gridHeight; row++) {
		for (var col = 0; col < this.gridWidth; col++) {
			callback(row, col, this.cells[row][col]);
		}
	}
};

Grid.prototype.setTile = function (tile) {
	this.cells[tile.row][tile.col] = tile;
};

// return null if there is no tile
Grid.prototype.getTile = function (position) {
	if (this.withinBounds(position)) {
		return this.cells[position.row][position.col];
	} else {
		return null;
	}	
};

Grid.prototype.withinBounds = function (position) {
	return position.row >= 0 && position.row < this.gridHeight &&
		   position.col >= 0 && position.col < this.gridWidth;
};

Grid.prototype.serialize = function () {
	var row, idx, jdx;
	var cells = [];
	for (idx = 0; idx < this.gridHeight; idx++) {
		row = [];
		for (jdx = 0; jdx < this.gridWidth; jdx++) {
			row.push(this.cells[idx][jdx] ? this.cells[idx][jdx].serialize() : null);
		}
		cells[idx] = row;
	}
	return {
		width: this.gridWidth,
		height: this.gridHeight,
		cells: this.cells
	};
};
