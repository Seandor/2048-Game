window.onload = function () {
	var canvas = document.getElementById('game-container');
	var size = {width: 4, height: 4};
	var game = new TwentyFortyEight(size);
	var startGui = new GuiProcess(canvas, game);
};