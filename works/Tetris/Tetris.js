var relativeCoords = {
	L: [[1,0],[0,1],[0,2]],
	LR:[[1,0],[0,1],[2,0]],
	T: [[1,0],[2,0],[1,1]],
	I: [[0,1],[0,2],[0,3]],
	O: [[0,1],[1,0],[1,1]],
	Z: [[0,1],[1,1],[1,2]], 
	ZR:[[1,0],[1,1],[2,1]] //_l^
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
})(10, 16);

var Cube = {
	x: 0,
	y: 0,
	type: types[0],
	rotate: 0,
	color: colors[0],
	init: function(){
		this.x = Math.ceil(Board.w / 2);
		this.y = 0;
		this.type = types[Math.floor(Math.random() * 7)];
		this.rotate = Math.floor(Math.random() * 4);
		this.color = colors[Math.floor(Math.random() * 4)];
		return this;
	},
};

Cube = Cube.init();
console.log(Cube.type);
relativeCoords[Cube.type].unshift([0,0])
relativeCoords[Cube.type].forEach(function(v, i, arr){
	Board.set(v[0], v[1], {
		status: 1,
		color: Cube.color
	});
});

(function(){
	var board = document.getElementById('board');
	for (var i = 0; i < 160; i++) {
		var div = document.createElement('div');
		var o = Board.get(i % 10, parseInt(i / 10));
		board.appendChild(div);
		div.style.backgroundColor = o.status == 0 ? '#fff' : o.color;
	}
})();