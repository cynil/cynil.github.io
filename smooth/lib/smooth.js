define(['hammer', 'zepto'], function(Hammer, $){
'use strict'

function toArray(list){
    return Array.prototype.slice.call(list)
}
function isFunction(fn){
  return Object.prototype.toString.call(fn) === '[object Function]'
}
function next(dir, val, arr){
    var index = arr.indexOf(val)
    if(index === -1) return -1
    return arr[(index + dir + arr.length) % arr.length]
}

var view = (function() {
    var W = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,
        H = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0

    return {
        W: W,
        H: H
    }
})()

function hm(el){
    var el = typeof el === 'string' ? document.querySelector(el) : el
    var hmer = new Hammer(el)
    hmer.get('swipe').set({direction: Hammer.DIRECTION_ALL})
    hmer.get('pan').set({direction: Hammer.DIRECTION_ALL})
    
    return hmer
}

function anime(el, klass, cb){
    el.addClass(klass)
    el.one('animationend', function(event){
        el.removeClass(klass)
        if(isFunction(cb)){
            cb()
        }
    })
}

function Smooth(el, options){
    this.el = el
    this.options = options || {}
    this.stages = []
    this.init()
}

Smooth.prototype = {
    constructor: Smooth,
    init: function(){
        var self = this
        var rawStage = this.el.querySelectorAll('.stage')
        
        toArray(rawStage).map(function(raw){
            self.stages.push(new Stage(raw, self))
        })

        this._bindAll()
        this.currentStage = null
        this.load(this.stages[0])
    },
    _bindAll: function(){
        var self = this,throttler

        hm(document.body).on('swipe', function(event){
            if(self.options.dir === 'h'){
                if(event.direction === 2){
                    self.load(next(1, self.currentStage, self.stages))
                }else if(event.direction === 4){
                    self.load(next(-1, self.currentStage, self.stages))
                }                
            }else{
                if(event.direction === 8){
                    self.load(next(1, self.currentStage, self.stages))
                }else if(event.direction === 16){
                    self.load(next(-1, self.currentStage, self.stages))
                }
            }
        })

        if(this.options.flow === true){
            hm(document.body).on('tap', function(event){

                if (event.target.occupied === true) return

                clearTimeout(throttler)

                throttler = setTimeout(function(){
                    var current = self.currentStage.blocs[self.currentStage.currentBloc]
                    
                    if(current){
                        anime($(current.el), current.animate, function(){
                            $(current.el).css({'opacity': '1'})
                            self.currentStage.currentBloc++
                        })
                    }else if(!current){
                        self.load(next(1, self.currentStage, self.stages))
                        self.currentStage.currentBloc = 0
                    }
                }, 400)
            })
        }
    },

    anchor: function(tag, target){
        var self = this,
        targetStage = this.stages.filter(function(stage){
            return stage.el.id === target.slice(1)
        })[0]

        if(targetStage === undefined) {
            throw new Error('smooth.js: anchor binding failed, target stage not found.')
        }

        $(tag)[0].occupied = true
        hm(tag).on('tap', function(event){
            if($(event.target).closest('.bloc').css('opacity') < 1) return
            self.load(targetStage)
        })
    },

    load: function(stage){
        if(!(stage instanceof Stage)) return false

        var self = this,
            $el = $(stage.el),
            toBeRemoved = this.currentStage
        var index = this.stages.indexOf(stage),
            prevIndex = this.stages.indexOf(this.currentStage),
            isFromNextStage = index < prevIndex

        if(toBeRemoved) $(toBeRemoved.el).css({'zIndex': '0'})
        $el.css({zIndex:'1',transform: 'translateX(0)'})

        anime($el, isFromNextStage ? stage.animate + 'Reverse': stage.animate, function(){
            self.currentStage = stage
            $el.css({opacity: '1'})
            stage.clean = false
            if(toBeRemoved && !!toBeRemoved.clean === false) {
                toBeRemoved.clear()
            }
            if(stage.nowblocs.length > 0){
                stage.nowblocs.map(function(nowbloc){
                    anime($(nowbloc.el), nowbloc.animate, function(){
                        $(nowbloc.el).css({'opacity': '1'})
                    })
                })
            }
        })
    }
}

function Stage(el, host){
    this.el = el
    this.host = host
    this.animate = this.el.getAttribute('animate') || 'bottomIn'
    this.init()
}

Stage.prototype = {
    constructor: Stage,
    init: function(){
        var self = this
        var rawBlocs = this.el.querySelectorAll('.bloc')

        this.blocs = []; this.nowblocs = []; this.currentBloc = 0

        toArray(rawBlocs).map(function(raw){
            var animate = raw.getAttribute('animate') || 'bottomIn',
                now = raw.getAttribute('now'),
                delay = raw.getAttribute('delay')

            if(now !== undefined && now !== null){
                self.nowblocs.push({
                    el: raw,
                    animate: animate
                })
            }else{
                self.blocs.push({
                    el: raw,
                    animate: animate
                })
            }

            if(delay) $(raw).css({'animation-delay': delay})
        })
    },
    clear: function(){
        var self = this, 
            blocs = this.blocs.concat(this.nowblocs),
            $el = $(this.el)

        this.currentBloc = 0
        $el.css({
            'transform':'translateX(-100%)',
            'opacity': '0'
        })

        blocs.map(function(bloc){
            $(bloc.el).css({'opacity': '0'})
        })
        this.clean = true
    }
}

Smooth.utils = {
    toArray: toArray,
    hm: hm
}

return Smooth
})