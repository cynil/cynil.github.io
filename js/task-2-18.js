
var queue =[];

function renderQueue(){
	var field = document.getElementById("field");
	field.innerHTML = "";
	for (var i = 0; i < queue.length; i++) {
		var cube = document.createElement("div");
		cube.innerHTML=queue[i];
		cube.className = "cube";
		field.appendChild(cube);
	};
}

function unshift(){
	var v = document.getElementById("v");
	queue.unshift(v.value);
}
function shift(){
	alert("即将从左侧删除" + queue.shift());
}
function push(){
	var v = document.getElementById("v");
	queue.push(v.value);
}
function pop(){
	alert("即将从右侧删除" + queue.pop());
}

function init(){
	document.body.onclick = function(event){
		if(event.target.nodeName === "BUTTON"){
			console.log(event.target.id);
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
			renderQueue();
		}
	}
}

init();
