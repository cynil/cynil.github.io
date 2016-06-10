var ROWS = 20,
	COLUMNS = 13
var relativeCoords = {
	L: [[0,0],[1,0],[0,1],[0,2]],
	LR:[[0,0],[1,0],[0,1],[2,0]],
	T: [[0,0],[1,0],[2,0],[1,1]],
	I: [[0,0],[0,1],[0,2],[0,3]],
	O: [[0,0],[0,1],[1,0],[1,1]],
	Z: [[0,0],[0,1],[1,1],[1,2]], 
	ZR:[[0,0],[1,0],[1,1],[2,1]] //_l^
//	1,1 2,1 2,2 3,2
}

var types = ['L','LR','T','I','O','Z','ZR'];

var colors = ['#5a5751', '#f7574a', '#63864a', '#297385', '#ef5b2c'];

var Board = (function(x, y){

	var board = new Array(x);

	for (var i = 0; i < x; i++) {
		board[i] = new Array(y);
	}

	for (var i = 0; i < x; i++) {
		for(j = 0; j < y; j++){
			board[i][j] = {
				status: 0,
				color: '#fff',
			}
		}
	}

	return {
		w: x,
		h: y,
		set: function(x, y, o){
			return board[x][y] = o;
		},
		get: function(x, y){
			return board[x][y];
		},
		getAll: function(){
			return board;
		}
	}
})(COLUMNS, ROWS);

var Cube = {
	x: 0,
	y: 0,
	type: types[0],
	rotate: 0,
	color: colors[0],
	initiated: false,
	init: function(){
		this.x = Math.floor(Board.w / 2 - 1);
		this.y = 0;
		this.type = types[Math.floor(Math.random() * 7)];
		this.rotate = Math.floor(Math.random() * 4);
		this.color = colors[Math.floor(Math.random() * 5)];
		this.initiated = true;
		return this;
	},
	go: function(dir, val){

		this[dir] += val;

		relativeCoords[Cube.type].forEach(function(v, i, arr){
			Board.set(Cube.x + v[0], Cube.y + v[1], {
				status: 1,
				color: Cube.color
			});
		});
	}
};

Cube.init().go('y', 2);

console.log(Cube.type + ': ' + relativeCoords[Cube.type]);

(function(){
	var board = document.getElementById('board');
	for (var i = 0; i < ROWS * COLUMNS; i++) {
		var div = document.createElement('div');
		var o = Board.get(i % COLUMNS, parseInt(i / COLUMNS));
		board.appendChild(div);
		div.style.backgroundColor = o.status == 0 ? '#fff' : o.color;
	}
})();