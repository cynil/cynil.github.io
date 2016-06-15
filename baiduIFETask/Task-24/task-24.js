//main
var myApp = {};

myApp.queue = [];

myApp.isAnimating = false;

myApp.eventHandllers = {
    traverseBFHandller: function(event){
        myApp.queue = [];
        myApp.model.traverseBF(function(node){
            myApp.queue.push(node.dom);
        });
        myApp.view.animate(myApp.queue);
    },
    traverseDFHandller: function(event){
        myApp.queue = [];
        myApp.model.traverseDF(function(node){
            myApp.queue.push(node.dom);
        });
        myApp.view.animate(myApp.queue);
    },
    searchHandller: function(event){
        myApp.queue = [];

        var result,
            key = $("key").value;

        myApp.model.traverseDF(function(node){
            if(node.data === key){
                result = node;
            }
            myApp.queue.push(node);
        });

        if(!result){
            return alert("cannot find.");
        }
        result.dom.className = "hilite";

        setTimeout(function(){
            result.dom.className = "";
        },1000);
    },
    addHandller: function(event){
        if(!$("key").value || !$$("hilite")){
            return alert("please enter name and(or) target.");
        }

        var val = $("key").value;
        var target = $$("hilite").childNodes[0].nodeValue;

        if(val === target){
            return alert("a same leaf has already been created, \nplease try another.");
        }

        myApp.model.add(val, target);
        myApp.view.renderModel();

        setTimeout(function(){
            $$("hilite").className = "";
        },1000);
    },
    removeHandller: function(event){
        if(!$$("hilite")) {
            return alert("Please choose target.");
        };

        var target = $$("hilite").childNodes[0].nodeValue;
        var fromm = $$("hilite").parentNode.childNodes[0].nodeValue;

        myApp.model.remove(target, fromm);
        myApp.view.renderModel();

        setTimeout(function(){
            $$("hilite").className = "";
        },1000);
    },
}

myApp.model = new Tree("root");

myApp.view = {
    animate: function(queue){

        myApp.isAnimating = true;

        var i = 1;
        queue[0].className = "hilite";

        var clock = setInterval(function(){
            if(queue[i]){
                queue[i-1].className = "";
                queue[i].className = "hilite";
                if(i === queue.length - 1){
                    setTimeout(function(){
                        queue[queue.length - 1].className = "";                 
                    }, 1000);
                }
                i++;    
            }else{
                clearInterval(clock);
                myApp.isAnimating = false;
            }
        }, 1000);
    },

    renderModel: function(){
        myApp.model.initDOM();
        $("view").innerHTML = "";
        myApp.model.traverseBF(function(node){
            if(node.parent){
                node.parent.dom.appendChild(node.dom);
                console.log(node.dom, node.parent.dom);
            }
        });

        $("view").appendChild(myApp.model._root.dom);
    },
}

myApp.controller = (function(){
    $("view").addEventListener("click", function(event){
        Array.prototype.map.call(this.getElementsByTagName('div'), function(v, i, arr){
            v.className = "";
        });
        event.target.className = "hilite";
    });

    $("trav-bf").addEventListener("click", myApp.eventHandllers.traverseBFHandller);
    $("trav-df").addEventListener("click", myApp.eventHandllers.traverseDFHandller);
    $("add").addEventListener("click", myApp.eventHandllers.addHandller);
    $("remove").addEventListener("click", myApp.eventHandllers.removeHandller);
    $("search").addEventListener("click", myApp.eventHandllers.searchHandller);

    return "i am not undefined, i am a controller.:-)"
})();

function init(){

    myApp.model.add("c1", "root");
    myApp.model.add("c2", "root");
    myApp.model.add("c3", "root");
    myApp.model.add("c1-1","c1");
    myApp.model.add("c1-2","c1");
    myApp.view.renderModel();

}

init();
