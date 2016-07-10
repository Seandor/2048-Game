function TwentyFortyEight (size) {
	// width and height is measured by tile
	this.boardWidth 	= size.width;
	this.boardHeight 	= size.height;
	this.startTiles 	= 2;
	this.grid 	= new Grid(this.boardWidth, this.boardHeight);

	this.inputManager 	= new InputManager();
	this.guiManager		= new GuiManager(size);

	this.inputManager.on("move", this.move.bind(this));
	this.inputManager.on("newgame", this.reset.bind(this));

	this.best 			= 0;
	this.reset();
}

TwentyFortyEight.prototype.reset = function () {
	this.grid 	= new Grid(this.boardWidth, this.boardHeight);
	this.score 	= 0;
	this.won	= false;
	this.over 	= false;
	this.addStartTiles();
	// notify the gui module
	this.guiManager.init();
	this.guiManager.updateScore(this.score);
	this.guiManager.drawAllTiles(this.grid);
};

TwentyFortyEight.prototype.getBoardWidth = function () {
	return this.boardWidth;
};

TwentyFortyEight.prototype.getBoardHeight = function () {
	return this.boardHeight;
};

TwentyFortyEight.prototype.isGameTerminated = function ()  {
	return this.won || this.over;
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
	if (self.isGameTerminated()) {
		console.log("game over");
	}

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
			// set merged tile 
			self.grid.traverseAndSetTile(tileIndices[idx], directionVector, traversalSteps, mergedLine);
		}
	}

	if (merged) {
		if (self.score > self.best) {
			self.best = self.score;
			self.guiManager.updateBest(self.best);
		}
		self.guiManager.updateScore(self.score);
		self.newTile();
		// notify the gui module
		self.guiManager.drawAllTiles(self.grid);
	} 

	if (!self.movesAvailable()) {
		this.over = true; //game over
	}
};

TwentyFortyEight.prototype.movesAvailable = function () {
	return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

TwentyFortyEight.prototype.tileMatchesAvailable = function () {
	var self = this;

	var tile;

	for (var row = 0; row < self.grid.gridHeight; row++) {
		for (var col = 0; col < self.grid.gridWidth; col++) {
			tile = self.grid.cells[row] [col];
			if (tile) {
				for (var direction = 0; direction < 4; direction++) {
					var vector = self.getVector(direction);
					var otherPosition = {row: row + vector.row, col: col + vector.col};
					var other = self.grid.getTile(otherPosition);
					if (other && other.value === tile.value) {
						return true; // Matches available
					}
				}
			}
		}
	}
};

// return a merged list
TwentyFortyEight.prototype.merge = function (line) {
	var self = this;
	var mergedLine = self.slide(line);
	for (var idx = 0; idx < mergedLine.length; idx++) {
		if (mergedLine[idx] === null) {
			continue;
		}
		if (idx < (mergedLine.length - 1) && mergedLine[idx] === mergedLine[idx+1]) {
			mergedLine[idx] += mergedLine[idx];
			mergedLine[idx+1] = null;
			// add score
			self.score += mergedLine[idx];
			// game won condition
			if (mergedLine[idx] === 2048) self.won = true;
		}
	}
	return self.slide(mergedLine);
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
