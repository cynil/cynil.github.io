var queue =[];

var snapshots = [];

var isAnimated = false;

function $(id){
	return document.getElementById(id)
}
//中央已经决定了，由你来渲染队列
function renderQueue(arr){

	var field = $("field");
	field.innerHTML = "";
	for (var i = 0; i < arr.length; i++) {
		//生成柱状条
		var cube = document.createElement("div");
		cube.className = "cube";
		cube.style.height = (arr[i] * 2) + 'px';
		field.appendChild(cube);
		//柱状条顶部数字
		var hint = document.createElement('span');
		hint.innerHTML = arr[i];
		hint.className = 'hint';
		cube.appendChild(hint);
	};
}

function validate(arr, v){
	return (arr.length < 60) && (v.match(/^\s*\d\d\s*$/g));
}
//对队列的CRUD操作
function unshift(){
	var v = $("v");
	if(!validate(queue, v.value)) return;
	console.log(v.value);
	queue.unshift(v.value);
}
function shift(){
	if(!queue.length) return;
	alert("即将从左侧删除" + queue.shift());
}
function push(){
	var v = $("v");
	if(!validate(queue, v.value)) return;
	queue.push(v.value);
}
function pop(){
	if(!queue.length) return;
	alert("即将从右侧删除" + queue.pop());
}
//排序算法
function sortQueue(arr){
	var temp;
	snapshots = [];
	for(var i = 0; i < arr.length; i++){
		for(j = arr.length - 1; j > i; j--){
			if(arr[j] > arr[j - 1]){
				temp = arr[j];
				arr[j] = arr[j-1];
				arr[j-1] = temp;
		}
		//Magic.直接用arr，由于arr是按引用传递的，snapshots出来后全是排好顺序的
		snapshots.push(JSON.parse(JSON.stringify(arr)));
		}
	}

	return arr;
}
function randomGenerateQueue(l){

	var arr =[];
	for (var i = 0; i < l; i++) {
		arr.push(parseInt(Math.random()*90 + 10));
	}
	return arr;
}

function init(){
	$("crud").addEventListener('click', function(event){
		//事件代理，比一个个绑定不知道高到哪里去了
		//如果动画还没结束，不允许用户操作
		if(isAnimated){
			return alert("动画尚未结束！");
		}
		if(event.target.nodeName === "BUTTON"){
			switch (event.target.id){
				case "unshift":
					unshift();
					break;
				case "shift":
					shift();
					break;
				case "push":
					push();
					break;
				case "pop":
					pop();
					break;
			}
			renderQueue(queue);
		}
	}, false);
	$('sort').addEventListener('click', function(){
		sortQueue(queue);
		timer = setInterval(function(){
			//动画开始
			isAnimated = true;
			renderQueue(snapshots.shift());
			if(!snapshots.length){
				clearInterval(timer);
				//动画结束
				isAnimated = false;
			}
		}, 50);
	},false);
	$('random').addEventListener('click', function(){
		queue = [];
		for (var i = 0; i < randomGenerateQueue(16).length; i++) {
			queue.push(randomGenerateQueue(16)[i]);
		}
		renderQueue(queue);
	}, false);
}

init();