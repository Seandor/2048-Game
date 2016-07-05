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

function testGrid() {
	var grid = new Grid(3, 4);
	var size = {width: 3, height: 4};
	var game = new TwentyFortyEight(size);
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