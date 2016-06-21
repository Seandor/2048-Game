function TwentyFortyEight (canvas, size) {
	// width and height is measured by tile
	this.boardWidth 	= size.width;
	this.boardHeight 	= size.height;
	this.startTiles 	= 2;
	this.grid 	= new Grid(this.boardWidth, this.boardHeight);

	this.inputManager 	= new InputManager();
	this.guiProcess		= new GuiProcess(canvas, size);

	this.inputManager.on("move", this.move.bind(this));
	this.reset();
}

TwentyFortyEight.prototype.reset = function () {
	this.grid 	= new Grid(this.boardWidth, this.boardHeight);
	this.score 	= 0;
	this.won	= false;
	this.addStartTiles();
	// notify the gui module
	this.guiProcess.drawAllTiles(this.grid);
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

// move tiles on the grid in the specified direction
TwentyFortyEight.prototype.move = function (direction) {
	// 0: UP 1: RIGHT 2: DOWN 3: LEFT
	var self = this;
	var merged = false;

	var traversalSteps;
	if (direction === 0 || direction === 2) {
		traversalSteps = self.boardHeight;
	} else {
		traversalSteps = self.boardWidth;
	}
	var directionVector = self.getVector(direction);
	var tileIndices = self.getTileIndices(direction);
	var traversals;
	var mergedLine;

	for (var idx = 0; idx < tileIndices.length; idx++) {
		traversals = self.grid.traverse(tileIndices[idx], directionVector, traversalSteps);
		mergedLine = self.merge(traversals);
		if (self.isEqualArray(traversals, mergedLine)) {
			continue;
		} else {
			merged = true;
		}

		// set merged tile 
		self.grid.traverseAndSetTile(tileIndices[idx], directionVector, traversalSteps, mergedLine);
	}

	if (merged) {
		self.newTile();
		// notify the gui module
		self.guiProcess.drawAllTiles(self.grid);
	}
};

// return a merged list
TwentyFortyEight.prototype.merge = function (line) {
	var mergedLine = this.slide(line);
	for (var idx = 0; idx < mergedLine.length; idx++) {
		if (mergedLine[idx] === null) {
			continue;
		}
		if (idx < (mergedLine.length - 1) && mergedLine[idx] === mergedLine[idx+1]) {
			mergedLine[idx] += mergedLine[idx];
			mergedLine[idx+1] = null;
		}
	}
	return this.slide(mergedLine);
};

// used only in merge function
// to slide a list 
TwentyFortyEight.prototype.slide = function (line) {
	var slidedLine = [];
	var index = 0;
	for (var dummy = 0; dummy < line.length; dummy++) {
		slidedLine.push(null);
	}
	for (idx = 0; idx < line.length; idx++) {
		if (line[idx] !== null) {
			slidedLine[index] = line[idx];
			index += 1;
		}
	}
	return slidedLine;
};

// return a list of tile indices in the specified direction
TwentyFortyEight.prototype.getTileIndices = function (direction) {
	// 0: UP 1: RIGHT 2: DOWN 3: LEFT
	var upList 		= [];
	var rightList 	= [];
	var downList 	= [];
	var leftList 	= [];
	for (var idx = 0; idx < this.boardWidth; idx++) {
		upList.push({
			row: 0,
			col: idx
		});
		downList.push({
			row: this.boardHeight - 1,
			col: idx
		});
	}

	for (idx = 0; idx < this.boardHeight; idx++) {
		rightList.push({
			row: idx,
			col: this.boardWidth - 1
		});
		leftList.push({
			row: idx,
			col: 0
		});
	}

	var tileIndices = {
		0: upList,
		1: rightList,
		2: downList,
		3: leftList
	};
	return tileIndices[direction];
};

TwentyFortyEight.prototype.isEqualArray = function (arr1, arr2) {
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (var idx = 0; idx < arr1.length; idx++) {
		if (arr1[idx] !== arr2[idx]) {
			return false;
		}
	}
	return true;
};

TwentyFortyEight.prototype.serialize = function () {
	return this.grid.serialize();
};

function testGame() {
	var size = {width: 4, height: 4};
	var game = new TwentyFortyEight(size);
	console.log(game.serialize());
	// game.move(2); //down
	// console.log(game.serialize());
}

function testMerge() {
	var size = {width: 4, height: 4};
	var game = new TwentyFortyEight(size);
	var suite = new TestSuite();
	suite.runTest(game.merge([2, null, 2, 2]), [4, 2, null, null], "Case 1: ");
	suite.runTest(game.merge([null, null, 2, 2]), [4, null, null, null], "Case 2: ");
	suite.runTest(game.merge([2, 2, null, null]), [4, null, null, null], "Case 3: ");
	suite.runTest(game.merge([2, 2, 2, 2, 2]), [4, 4, 2, null, null], "Case 4: ");
	suite.runTest(game.merge([8, 16, 16, 8]), [8, 32, 8, null], "Case 5: ");
	suite.reportResults();
}