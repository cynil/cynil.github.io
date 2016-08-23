;(function Loading(callback){
        
    var $mask = U.$('#loading')

    U.addEvent(window, 'load', function(){
        var now = +new Date
        
        if(now - then < 800){
            $mask.className = 'fadeout-slowly'
        }else{
            $mask.className = 'fadeout'
        }
    })
    
    U.addEvent($mask, 'animationend', function(){
        document.body.removeChild(this)
        callback()
    })
})(function Init(){
    var page = 0
    
    CommandQueue.fetch(page)

    CommandQueue.forward()
    
    U.addEvent(window, 'click', function(){

        if(CommandQueue.length > 0){

            CommandQueue.forward()

        }else{

            PageLoader.load(++page)
            CommandQueue.fetch(++page)

        }

    })
    U.addEvent(window, 'contextmenu', function(){

        if(CommandQueue.obsLength > 0){

            CommandQueue.back()

        }else{

            PageLoader.load(--page)
            CommandQueue.fetch(--page)
            
        }
    })    
})

;(function Basics(){
    function Animator(el, easing){
        this.el = U.$(el)
        this.easing = easing || function(p){return p}
    }
    
    Animator.prototype.start = function(property, T, S){
        var then = +new Date
            
        requestAnimationFrame(function step(){})
    }
    
    function Command(receiver, options){
        this.receiver = receiver
    }
    
    Command.prototype.execute = function(){
        this.receiver.start()
    }
    
    var CommandQueue = {
        todo: [],
        done: [],
        length: 0,
        obsLength: 0,
        locked: false,

        add: function(){},

        forward: function(){},

        back: function(){},

        fetch: function(){}
    }

    var PageLoader = {}
    
    var easing = {
        linear: function(p){
            return p
        },
        accelerate: function(p){
            return p * p
        }
        //and more
    }
})()
// CommandQueue.add(new Animator('#d1', 'bounce'), {
// 	property: 'top',
// 	T: 1000,
// 	S: 200
// })