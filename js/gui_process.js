// handle the gui part of the game
// positions are in a form like this:
// 
function GuiProcess (canvas, size) {
	this.canvas 	= canvas;
	this.context 	= canvas.getContext("2d");
	this.size 		= size;

	this.tileSize   = 100;
	this.padding   	= Math.round(this.tileSize / 7);
	this.radius 	= 5;
	this.backgroundColor = "#BBADA0";
	
	this.setBoardSize(this.size);
	this.drawBoard();
}


GuiProcess.prototype.drawBoard = function () {
	var ctx = this.context;
	ctx.save();
	this.roundRect(0, 0, this.canvas.width, this.canvas.height, this.radius);
	ctx.fillStyle = this.backgroundColor;
	ctx.fill();
	ctx.restore();
};

// draw all tiles depending on the grid
GuiProcess.prototype.drawAllTiles = function (grid) {
	var self = this;
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
	var textPosition = {
		x: position.x + this.tileSize / 2,
		y: position.y + this.tileSize / 2
	};
	this.drawTileBackground(position, value);
	if (value !== null) {
		this.drawTileText(textPosition, value);
	}
};

GuiProcess.prototype.drawTileBackground = function (position, value) {
	var ctx = this.context;
	var size = this.tileSize;
	ctx.save();
	this.roundRect(position.x, position.y, size, size, this.radius);
	ctx.fillStyle = this.getTileColor(value);
	ctx.fill();
	ctx.restore();
};

GuiProcess.prototype.drawTileText = function (textPosition, value) {
	var ctx = this.context;
	var fillColor;
	ctx.save();
	// need to fix the font size later
	ctx.font="40px Helvetica bold";
	ctx.fillStyle = this.getTextColor(value);
	ctx.textBaseline="middle";
	ctx.textAlign = "center";
	ctx.fillText(value, textPosition.x, textPosition.y);
	ctx.restore();
};

// get tile text color
GuiProcess.prototype.getTextColor = function (tileValue) {
	var lightWhite  = "#F9F6F2";
	var brownColor	= "#776E65";
	if (tileValue === 2 || tileValue === 4) {
		return brownColor;
	} else {
		return lightWhite;
	}
};

// store tile colors
GuiProcess.prototype.getTileColor = function (tileValue) {
	var COLORS = {
		tnull:  "#CDC1B4",
		t2: 	"#EEE4DA",
		t4: 	"#EDE0C8",
		t8: 	"#F2B179",
		t16: 	"#F59563",
		t32: 	"#F67C5F",
		t64: 	"#F65E3B",
		t128: 	"#EDCF72",
		t256: 	"#EDCC61",
		t512: 	"#EDC850",
		t1024: 	"#EDC53F",
		t2048: 	"#EDC22E",
	};
	var value = "t" + tileValue;
	return COLORS[value];
};

GuiProcess.prototype.setBoardSize = function (size) {
	var cols = size.width;
	var rows = size.height;
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
	ctx.arc(startX + width - radius, startY + height - radius, radius, 0, Math.PI / 2);
	ctx.lineTo(startX + radius, startY + height);
	ctx.arc(startX + radius, startY + height - radius, radius, Math.PI / 2, Math.PI);
	ctx.closePath();
};