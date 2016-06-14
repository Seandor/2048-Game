// handle the gui part of the game
function GuiProcess (canvas, twentyFortyEight) {
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.game = twentyFortyEight;
	this.init();
}

GuiProcess.prototype.init = function () {
	this.setScale();
};

GuiProcess.prototype.setScale = function () {
	var cols = this.game.getBoardWidth();
	var rows = this.game.getBoardHeight();
	this.canvas.width = cols * 100 + (cols + 1) * 10;
	this.canvas.height = rows * 100 + (rows + 1) * 10;
};