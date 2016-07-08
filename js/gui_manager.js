// handle the gui part of the game
// positions are in a form like this:
// 
function GuiManager (canvas, size) {
	this.canvas 	= canvas;
	this.context 	= canvas.getContext("2d");
	this.size 		= size;

	this.tileSize   = 100;
	this.padding   	= Math.round(this.tileSize / 7);
	this.radius 	= 10;
	this.backgroundColor = "#BBADA0";
	
	this.setCanvasSize(this.size);
	this.drawBoard();
}


GuiManager.prototype.drawBoard = function () {
	var ctx = this.context;
	ctx.save();
	this.roundRect(0, 0, this.oriWidth, this.oriHeight, this.radius);
	ctx.fillStyle = this.backgroundColor;
	ctx.fill();
	ctx.restore();
};

// draw all tiles depending on the grid
GuiManager.prototype.drawAllTiles = function (grid) {
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
GuiManager.prototype.calculatePosition = function (row, col) {
	var xPos = col * this.tileSize + (col + 1) * this.padding;
	var yPos = row * this.tileSize + (row + 1) * this.padding;
	return {
		x: xPos,
		y: yPos
	};
};

GuiManager.prototype.drawTile = function (position, value) {
	var textPosition = {
		x: position.x + this.tileSize / 2,
		y: position.y + this.tileSize / 2
	};
	this.drawTileBackground(position, value);
	if (value !== null) {
		this.drawTileText(textPosition, value);
	}
};

GuiManager.prototype.drawTileBackground = function (position, value) {
	var ctx = this.context;
	var size = this.tileSize;
	ctx.save();
	// clear previous drawing add draw default color
	ctx.clearRect(position.x, position.y, size, size);
	ctx.fillStyle = this.backgroundColor;
	ctx.fillRect(position.x, position.y, size, size);

	this.roundRect(position.x, position.y, size, size, this.radius);
	ctx.fillStyle = this.getTileColor(value);
	ctx.fill();
	ctx.restore();
};

GuiManager.prototype.drawTileText = function (textPosition, value) {
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
GuiManager.prototype.getTextColor = function (tileValue) {
	var lightWhite  = "#F9F6F2";
	var brownColor	= "#776E65";
	if (tileValue === 2 || tileValue === 4) {
		return brownColor;
	} else {
		return lightWhite;
	}
};

// store tile colors
GuiManager.prototype.getTileColor = function (tileValue) {
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

GuiManager.prototype.setCanvasSize = function (size) {
	var self = this,
		cols = size.width,
		rows = size.height;
	// set canvas size
	self.canvas.width = cols * self.tileSize + (cols + 1) * self.padding;
	self.canvas.height = rows * self.tileSize + (rows + 1) * self.padding;

	// save the origin width and height for rendering
	self.oriWidth = self.canvas.width;
	self.oriHeight = self.canvas.height;

	// query the various pixel ratios
	var devicePixelRatio 	= Math.floor(window.devicePixelRatio) || 1,
	 	backingStoreRatio 	= self.context.webkitBackingStorePixelRatio ||
	                     	  self.context.mozBackingStorePixelRatio ||
	                     	  self.context.msBackingStorePixelRatio ||
	                          self.context.oBackingStorePixelRatio ||
	                          self.context.backingStorePixelRatio || 1,
	 	ratio = devicePixelRatio / backingStoreRatio;

	// upscale the canvas if the two ratios don't match
	if (devicePixelRatio !== backingStoreRatio) {
		self.canvas.width = self.oriWidth * ratio;
		self.canvas.height = self.oriHeight * ratio;

		self.canvas.style.width = self.oriWidth + 'px';
		self.canvas.style.height = self.oriHeight + 'px';

		// now scale the context to counter
		// the fact that we've manually scaled
		// our canvas element
		self.context.scale(ratio, ratio);
	}
};

// Score
GuiManager.prototype.updateScore = function (score) {
	document.querySelector(".score").textContent = score;
};

GuiManager.prototype.updateBest = function (best) {
	document.querySelector(".best").textContent = best;
};

// round rectangle path
// if radius is half of the width and height
// It becomes a circle :D
GuiManager.prototype.roundRect = function(startX, startY, width, height, radius) {
	var ctx = this.context;
	ctx.beginPath();
	ctx.arc(startX + radius, startY + radius, radius, Math.PI, Math.PI * 3 / 2);
	ctx.lineTo(startX + width - radius, startY);
	ctx.arc(startX + width - radius, startY + radius, radius, Math.PI * 3 / 2, 0);
	ctx.lineTo(startX + width, startY + height - radius);
	ctx.arc(startX + width - radius, startY + height - radius, radius, 0, Math.PI / 2);
	ctx.lineTo(startX + radius, startY + height);
	ctx.arc(startX + radius, startY + height - radius, radius, Math.PI / 2, Math.PI);
	ctx.lineTo(startX, startY + radius);
};