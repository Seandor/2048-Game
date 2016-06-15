// handle the gui part of the game
// positions are in a form like this:
// 
function GuiProcess (canvas, twentyFortyEight) {
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.game = twentyFortyEight;
	this.grid = this.game.grid;
	this.init();
}

GuiProcess.prototype.init = function () {

	this.tileSize   = 100;
	this.padding   	= Math.round(this.tileSize / 7);
	this.radius 	= 5;
	this.color 		= {
		background: "#BBADA0",
		cnull: 	"#CDC1B4",
		c2: 	"#EEE4DA",
		c4:		"#EDE0C8",
	};
	this.setBoardSize();
	this.drawBoard();
	this.drawAllTile();
};

GuiProcess.prototype.drawBoard = function () {
	this.context.save();
	this.roundRect(0, 0, this.canvas.width, this.canvas.height, this.radius);
	this.context.fillStyle = this.color.background;
	this.context.fill();
	this.context.restore();
};

GuiProcess.prototype.drawAllTile = function () {
	var self = this;
	var grid = self.grid;
	var pos;
	var value;
	grid.eachCell(function (row, col, tile) {
		pos = self.calculatePosition(row, col);
		value = tile ? tile.value : null;
		self.drawTile(pos, value);
	});
};

// Return a cell's position given its index on the board
GuiProcess.prototype.calculatePosition = function (row, col) {
	var xPos = col * this.tileSize + (col + 1) * this.padding;
	var yPos = row * this.tileSize + (row + 1) * this.padding;
	return {
		x: xPos,
		y: yPos
	};
};

GuiProcess.prototype.drawTile = function (position, value) {
	var ctx = this.context;
	var size = this.tileSize;
	ctx.save();

	this.roundRect(position.x, position.y, size, size, this.radius);
	ctx.fillStyle = this.color.cnull;
	ctx.fill();

	ctx.restore();
};

GuiProcess.prototype.setBoardSize = function () {
	var cols = this.game.getBoardWidth();
	var rows = this.game.getBoardHeight();
	this.canvas.width = cols * this.tileSize + (cols + 1) * this.padding;
	this.canvas.height = rows * this.tileSize + (rows + 1) * this.padding;
};

// round rectangle path
// if radius is half of the width and height
// It becomes a circle :D
GuiProcess.prototype.roundRect = function(startX, startY, width, height, radius) {
	var ctx = this.context;
	ctx.beginPath();
	ctx.arc(startX + radius, startY + radius, radius, Math.PI, Math.PI * 3 / 2);
	ctx.lineTo(startX + width - radius, startY);
	ctx.arc(startX + width - radius, startY + radius, radius, Math.PI * 3 / 2, 0);
	ctx.lineTo(startX + width, startY + height - radius);
	ctx.arc(startX + width - radius, startY + width - radius, radius, 0, Math.PI / 2);
	ctx.lineTo(startX + radius, startY + height);
	ctx.arc(startX + radius, startY + width - radius, radius, Math.PI / 2, Math.PI);
	ctx.closePath();
};