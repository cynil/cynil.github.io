//util
function $(sel){
    return document.getElementById(sel);
}
function $$(sel){
    return document.getElementsByClassName(sel)[0];
}
function wrap(val){
    var el = document.createElement('div');
    el.innerHTML = val;
    return el;
}
function findIndex(arr, data) {
    var index;
 
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].data === data) {
            index = i;
        }
    }
 
    return index;
}
//create tree and node

function Node(data) {
    this.data = data;
    this.dom = wrap(this.data);
    this.parent = null;
    this.children = [];
}

function Tree(data) {
    var node = new Node(data);
    this._root = node;
}

Tree.prototype.traverseDF = function(callback) {
     (function recurse(currentNode) {
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            recurse(currentNode.children[i]);
        }
         callback(currentNode);
     })(this._root);
};

Tree.prototype.traverseBF = function(callback) {
    var queue = [];
 
    queue.push(this._root);
 
    currentTree = queue.shift();
 
    while(currentTree){
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            queue.push(currentTree.children[i]);
        }
 
        callback(currentTree);
        currentTree = queue.shift();
    }
};

Tree.prototype.contains = function(callback) {
    this.traverseDF(callback);
};

Tree.prototype.add = function(data, toData) {
    var child = new Node(data),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };
 
    this.contains(callback);
 
    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        throw new Error('Cannot add node to a non-existent parent.');
    }
};

Tree.prototype.remove = function(data, fromData) {
    var tree = this,
        parent = null,
        childToRemove = null,
        index;
 
    var callback = function(node) {
        if (node.data === fromData) {
            parent = node;
        }
    };
 
    this.contains(callback);
 
    if (parent) {
        index = findIndex(parent.children, data);
 
        if (index === undefined) {
            throw new Error('Node to remove does not exist.');
        } else {
            childToRemove = parent.children.splice(index, 1);
        }
    } else {
        throw new Error('Parent does not exist.');
    }
 
    return childToRemove;
};
Tree.prototype.initDOM = function(){
    this.traverseDF(function(node){
        node.dom = wrap(node.data);
    });
}
