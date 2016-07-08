function InputManager() {
	this.events = {};
	this.listen();
}

InputManager.prototype.on = function (event, callback) {
	if (!this.events[event]) {
		this.events[event] = [];
	}
	this.events[event].push(callback);
};

InputManager.prototype.emit = function (event, data) {
	var callbacks = this.events[event];
	if (callbacks) {
		callbacks.forEach(function (callback) {
			callback(data);
		});
	}
};

InputManager.prototype.listen = function () {
	var self = this;

	var KEYMAP = {
		38: 0, // up
		39: 1, // right
		40: 2, // down
		37: 3, // left
		75: 0, // vim up
		76: 1, // vim right
		74: 2, // vim down
		72: 3, // vim left
		87: 0, // w
		68: 1, // d
		83: 2, // s
		65: 3  // a
	};

	// bind event and handle
	document.addEventListener("keydown", function (event){
		var modifiers  = event.ctrlKey || event.shiftKey || event.altKey ||
						 event.metaKey;
		var direction  = KEYMAP[event.which];
		if (!modifiers) {
			if (direction !== undefined) {
				event.preventDefault();
				self.emit("move", direction);
			}
		}
	});

	document.querySelector(".new-game").addEventListener("click", function () {
		self.emit("newgame");
	});
};