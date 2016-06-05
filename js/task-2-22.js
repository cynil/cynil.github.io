//Utils

function $(sel){
	return document.getElementById(sel);
}

//Model

function Node(parent, left, right){
	if(!(this instanceof Node)){
		return new Node(parent, left, right);
	}
	this.dom = document.createElement('div');
	this.parent = parent || null;
	this.left = left || null;
	this.right = right || null;

	if(this.parent){
		this.appendTo(this.parent.dom);
	}
}

Node.queue = [];

Node.prototype = {
	constructor: Node,
	appendTo: function(target){
		if(target.nodeType){
			target.appendChild(this.dom);
		}else{
			$(target).appendChild(this.dom);
		}
		return this;
	},
	build: function(depth){
		if(isNaN(depth) || depth === 0){
			return false;
		}
		this.dom.className = "level-" + (depth + 1);
		if(depth === 1){
			//console.log('depth 1');
			this.left = new Node(this, null, null);
			this.right = new Node(this, null, null);
			this.left.dom.className = "level-" + depth;
			this.right.dom.className = "level-" + depth;
		}else{
			this.left = new Node(this, null, null);
			this.right = new Node(this, null, null);
			this.left.dom.className = "level-" + depth;
			this.right.dom.className = "level-" + depth;

			this.left.build(depth - 1);
			this.right.build(depth - 1);
		}
		return this;
	},
	travelPre: function(){
		if(this.left && this.right){
			Node.queue.push(this.dom);
			this.left.travelPre();
			this.right.travelPre();
		}else{
			Node.queue.push(this.dom);
		}
	},
	travelIn: function(){
		if(this.left && this.right){
			this.left.travelIn();
			Node.queue.push(this.dom);
			this.right.travelIn();
		}else{
			Node.queue.push(this.dom);
		}
	},
	travelPost: function(){
		if(this.left && this.right){
			this.left.travelPost();
			this.right.travelPost();
			Node.queue.push(this.dom);
		}else{
			Node.queue.push(this.dom);
		}
	}
}

//View

function generateDOM(node,target){
	if(!node instanceof Node){
		return;
	}
	node.appendTo(target);
}
function animate(queue){
	var i = 1;
	queue[0].style.backgroundColor = "#99f";

	var clock = setInterval(function(){
		if(queue[i]){
			queue[i-1].style.backgroundColor = "#fff";
			queue[i].style.backgroundColor = "#99f";
			if(i === queue.length - 1){
				setTimeout(function(){
					queue[queue.length - 1].style.backgroundColor = "#fff";					
				}, 1000);
			}
			i++;	
		}else{
			clearInterval(clock);
		}
	}, 1000);
}

//Controller

function init(){
	var myNode = null;
	$("build").addEventListener("click", function(){
		$("wrap").innerHTML = "";
		myNode = Node().build(Number($("depth").value));
		generateDOM(myNode,"wrap");
	});

	$("clear").addEventListener("click", function(){
		myNode = null;
		$("wrap").innerHTML = "";
	});

	$("travel").addEventListener("click", function(){

		Node.queue = [];

		if(event.target.nodeName.toLowerCase() === "button"){
			switch (event.target.id){
				case "preorder":
					myNode.travelPre();
					break;
				case "inorder":
					myNode.travelIn();
					break;
				case "postorder":
					myNode.travelPost();
					break;
			}
			animate(Node.queue);
		};
	});
}

init();
