// handle the gui part of the game

function GuiManager (size) {
	this.canvas 	= document.getElementById("game-board");
	this.context 	= this.canvas.getContext("2d");
	this.size 		= size;

	this.tileSize   = 100;
	this.padding   	= Math.round(this.tileSize / 7);
	this.radius 	= 10;
	this.backgroundColor = "#BBADA0";
}


GuiManager.prototype.setupStage = function () {
	this.setCanvasSize(this.size);
	this.drawBoard();
};

GuiManager.prototype.reset = function (grid) {
	this.setupStage();
	this.updateScore(0);
	this.clearGameMessage();
	this.draw(grid);
};

GuiManager.prototype.drawBoard = function () {
	var ctx = this.context;
	ctx.save();
	this.roundRect(0, 0, this.oriWidth, this.oriHeight, this.radius);
	ctx.fillStyle = this.backgroundColor;
	ctx.fill();
	ctx.restore();
};

// draw all tiles depending on the grid
GuiManager.prototype.draw = function (grid) {
	var self = this;
	var pos;

	grid.eachCell(function (row, col, tile) {
		pos = self.calculatePosition(row, col);
		self.drawTile(pos, tile);
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

GuiManager.prototype.drawTile = function (position, tile) {
	var value = tile ? tile.value : null;
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
	ctx.fillStyle = this.getTileColor(value) ? this.getTileColor(value) : "#000";
	ctx.fill();
	ctx.restore();
};

GuiManager.prototype.drawTileText = function (textPosition, value) {
	var ctx = this.context;
	var fillColor;
	var tileTextSize = this.getTileTextSize(value) + "px";
	ctx.save();
	// need to fix the font size later
	ctx.font="bold " + tileTextSize + " Clear Sans";
	ctx.fillStyle = this.getTextColor(value);
	ctx.textBaseline="middle";
	ctx.textAlign = "center";
	ctx.fillText(value, textPosition.x, textPosition.y);
	ctx.restore();
};

// tile text size is responsive to its value
// since it is very hard to reach 2048, no to 
// mention to get a 5 digit number :D
GuiManager.prototype.getTileTextSize = function (value) {
	var SIZEDIC = { 1: 54,
					2: 48,
					3: 40,
					4: 35 };
	return SIZEDIC[value.toString().length];
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
	// set original size
	self.oriWidth = cols * self.tileSize + (cols + 1) * self.padding;
	self.oriHeight  = rows * self.tileSize + (rows + 1) * self.padding;

	// query the various pixel ratios
	var devicePixelRatio 	= Math.ceil(window.devicePixelRatio) || 1,
	 	backingStoreRatio 	= self.context.webkitBackingStorePixelRatio ||
	                     	  self.context.mozBackingStorePixelRatio ||
	                     	  self.context.msBackingStorePixelRatio ||
	                          self.context.oBackingStorePixelRatio ||
	                          self.context.backingStorePixelRatio || 1,
	 	ratio = devicePixelRatio / backingStoreRatio;

	self.canvas.width = self.oriWidth * ratio;
	self.canvas.height = self.oriHeight * ratio;
	// upscale the canvas if the two ratios don't match
	if (devicePixelRatio !== backingStoreRatio) {
		self.canvas.style.width = self.oriWidth + 'px';
		self.canvas.style.height = self.oriHeight + 'px';

		// now scale the context to counter
		// the fact that we've manually scaled
		// our canvas element
		self.context.scale(ratio, ratio);
	}
};

// html change
GuiManager.prototype.getGameMessage = function (state) {
	var MESSAGE = { 0: {text: "Game Over!", class: "game-over"},
					1: {text: "You Won!", class: "game-won"}};
	return MESSAGE[state];
};

// Score
GuiManager.prototype.updateScore = function (score) {
	document.querySelector(".score").textContent = score;
};

GuiManager.prototype.updateBest = function (best) {
	document.querySelector(".best").textContent = best;
};

GuiManager.prototype.showGameMessage = function (state) {
	// 0: lose  1: won
	var message = this.getGameMessage(state);
	document.querySelector(".game-message p").textContent = message.text;
	document.querySelector(".game-message").classList.add(message.class);
};

GuiManager.prototype.clearGameMessage = function () {
	document.querySelector(".game-message p").textContent = "";
	document.querySelector(".game-message").className = "game-message";
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