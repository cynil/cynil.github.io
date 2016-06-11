//Main Idea
/*
 *define a cube object, the cube object has (x, y) attribute to describe its coordinates
 *we change (x, y) -->the cube injects the changes to an object named Board, which 
 *internally contains an two-dimensional array -->the DOMManager object will periodically
 *scan the Board, and render it in DOM.
 */
var ROWS = 20,
	COLUMNS = 13;

var relativeCoords = {
	// relativeCoords describes the shape of a certain cube

	//every type of cube has a base point, if we want to 
	//change the cube's coordinates, we can change the base point's
	//coordinates and then use the relative coordinates to do the rest.
	
	//well, how do i name these types? by their shapes:-)
    L: [[0,0],[1,0],[0,1],[0,2]],
	LR:[[0,0],[1,0],[0,1],[2,0]],
	T: [[0,0],[1,0],[2,0],[1,1]],
	I: [[0,0],[0,1],[0,2],[0,3]],
	O: [[0,0],[0,1],[1,0],[1,1]],
	Z: [[0,0],[0,1],[1,1],[1,2]],
	ZR:[[0,0],[1,0],[1,1],[2,1]]
};

var types = ['L','LR','T','I','O','Z','ZR'];

var colors = ['#5a5751', '#f7574a', '#63864a', '#297385', '#ef5b2c'];

var DOMManager = {
	init: (function(){
			var board = document.getElementById('board');
	
			for (var i = 0; i < ROWS * COLUMNS; i++) {
				var div = document.createElement('div');
				board.appendChild(div);
			}
			return '';
		})(),
	render: (function(){
		/*every 200ms the DOMManager will scan
         *the Board,which internally contains an board[][] to store data, 
         *then visualize its data by DOM manipulation.
		*/
		setInterval(function(){
			for (var i = 0; i < ROWS * COLUMNS; i++) {
				var o = Board.get(i % COLUMNS, parseInt(i / COLUMNS));
				board.childNodes[i].style.backgroundColor = o.status == 0 ? '#fff' : o.color;
			}
		}, 100);
	})(),
}

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
	}
	//here we reversed rows and columns, coz array's coordinates is different from common (x, y)
})(COLUMNS, ROWS);

var Cube = {
	// cube was designed as a singeleton 
	// we dont need to instantialize a cube every time,
	// when the cube go down enough we just reset its
	//attributes and use it again.
	x: 0,
	y: 0,
	type: types[0],
	rotate: 0,
	color: colors[0],

	reset: function(){

		this.x = Math.floor(Board.w / 2 - 1);
		this.y = 0;
		this.type = types[Math.floor(Math.random() * 7)];
		this.rotate = Math.floor(Math.random() * 4);
		this.color = colors[Math.floor(Math.random() * 5)];
		this.inject(false);

		return this;
	},

	inject: function(reset/*boolean*/){
		var o = {status: 1, color: this.color};

		if(reset) {
			o = {status: 0, color: '#fff'};
        }
		var that = this;
		//use its type to get its shape
		relativeCoords[this.type].forEach(function(v, i, arr){
			//for every point in this cube,caculate its absolute coords
			//(x, y) means its base point's coords,
			Board.set(that.x + v[0], that.y + v[1], o);
		});

	},

	go: function(dir, val){

		var tran = {
			x: this.x,
			y: this.y
		};
		tran[dir] += val
		var overflow = relativeCoords[this.type].some(function(v, i, arr){
			return tran.x + v[0] >= COLUMNS || tran.y + v[1] >= ROWS || tran.x + v[0] <= -1 || tran.y + v[1] <= -1;
		});
		if(overflow) return;

		//we should erase its previous position,
		this.inject(true);
		this[dir] += val;
		this.inject(false);
	}
};

Cube.reset();
document.onkeyup = function(event){
	var button = String.fromCharCode(event.keyCode).toUpperCase();
	switch (button){
		case 'A': 
			Cube.go('x', -1);
			break;
		case 'S':
			Cube.go('y', 1);
			break;
		case 'D':
			Cube.go('x',1);
	}
};