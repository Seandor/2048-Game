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

// Given a direction and start cell to traverse the grid
// return the traversal list
Grid.prototype.traverse = function(startPos, direction, numSteps) {
	// 0: UP 1: RIGHT 2: DOWN 3: LEFT
	var row, col;
	var traversal = [];
	for ( var i = 0; i < numSteps; i++ ) {
		row = startPos.row + i * direction.row;
		col = startPos.col + i * direction.col;
		traversal.push(this.cells[row][col] ? this.cells[row][col].getValue() : null);
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
	return this.cells[position.row][position.col];
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

// Test case

function testGrid() {
	var grid = new Grid(3, 4);
	var size = {width: 3, height: 4};
	var game = new twentyFortyEight(size);
	var suite = new TestSuite();
	// initialize the grid with proper value
	var number = 1;
	var position;
	var tile;
	grid.eachCell(function (row, col, value) {
		position = {row:row, col:col};
		tile = new Tile(position, number);
		grid.setTile(tile);
		number += 1;
	});

	console.log(grid.serialize());
	// test traverse functionality
	// 1  2  3
	// 4  5  6
	// 7  8  9
	// 10 11 12
	suite.runTest(grid.traverse({row: 0, col: 0}, game.getVector(0), 4), [1, 4, 7, 10], "Test case 1:"); // first column
	suite.runTest(grid.traverse({row: 1, col: 0}, game.getVector(3), 3), [4, 5, 6], "Test case 2:"); // second row
	suite.runTest(grid.traverse({row: 0, col: 1}, game.getVector(0), 4), [2, 5, 8, 11], "Test case 3:"); // second column
	suite.runTest(grid.traverse({row: 0, col: 2}, game.getVector(1), 3), [3, 2, 1], "Test case 4:"); // first row reverse
	suite.runTest(grid.traverse({row: 3, col: 0}, game.getVector(3), 3), [10, 11, 12], "Test case 5:"); // last row
	suite.runTest(grid.traverse({row: 3, col: 2}, game.getVector(2), 4), [12, 9, 6, 3], "Test case 6:"); // last column reverse

	tile = new Tile({row: 1, col: 1}, 100);
	grid.setTile(tile);
	suite.runTest(grid.getTile({row: 1, col: 1}).getValue(), 100, "Test case 7:");

	suite.reportResults();
}