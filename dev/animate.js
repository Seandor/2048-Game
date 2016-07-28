
var canvas = document.getElementById("game-board");
var ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 800;

function RoundRect(ctx, x, y, width, height, radius) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.radius = radius;
	this.ctx = ctx;
	this.beginX = this.x - parseInt(this.width / 3);
	this.beginY = this.y - parseInt(this.height / 3);
	this.increment = -5;
}


RoundRect.prototype.inflate = function () {
	this.currentWidth = this.width - 2*(this.beginX - this.x);
	this.currentHeight = this.height - 2*(this.beginY - this.y);

	if (this.x - this.beginX > 0) {
		this.increment = 5;
	} 
	else {
		this.increment = 0;
	}


	this.beginX += this.increment;
	this.beginY += this.increment;

	roundRect(this.ctx, this.beginX, this.beginY, this.currentWidth, this.currentHeight, this.radius);
	ctx.fillStyle = "blue";
	ctx.fill();
};

var roundRect = function(ctx, startX, startY, width, height, radius) {
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

var rRect = new RoundRect(ctx, 100, 100, 100, 100, 10);
var draw = function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	rRect.inflate();
	
	requestAnimationFrame(draw);
};

draw();