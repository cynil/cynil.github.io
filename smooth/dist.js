(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Smooth = require('./smooth.js')

window.addEventListener('DOMContentLoaded', function(){
    var main = document.querySelector('main')
    var smooth = new Smooth(main, {
        animations: {
            typing: function(node, parent){
                var p = node.getElementsByTagName('p')[0],
                    content = p.innerHTML,
                    index = 0

                p.innerHTML = ''
                parent.appendChild(node)
                var timer = setInterval(function(){
                    p.innerHTML += content[index++]
                    if(!content[index]) clearInterval(timer)
                }, 100)
            }
        },
        methods: {
            download: function(event, currentStage){
                window.location = 'https://github.com/cynil/smooth.js'
            }
        }
    })

    var indicator = document.createElement('div')
    indicator.style.cssText = "position:absolute;height:24px;width:100%;top:0;bottom:0;margin:auto;color:#323232;font-size:20px;text-align:center;"
    document.body.appendChild(indicator)

    smooth.on('ready', function(e){
        document.body.removeChild(indicator)
    })

    smooth.on('progress', function(e){
        console.log(e.current + '/' + e.total)
        indicator.innerHTML = e.current + '/' + e.total
    })
})

},{"./smooth.js":2}],2:[function(require,module,exports){
//smooth.js
//git repository: https://github.com/cynil/smooth.js
//?todo: on('event') hooks
//todo: canvas animation
//todo: a theme
//?todo: abstract of Event
(function(window, factory){
	if(typeof define === 'function' && define.amd){
		define(factory)
	}
	else if(typeof exports === 'object' && typeof module !== 'undefined'){
		module.exports = factory()
	}else{
		window.Smooth = factory()
	}
})(window, function(){
	'use strict';

	//utils

	function makeArray(list){
		return Array.prototype.slice.call(list)
	}
	function isFunc(thing){
		return Object.prototype.toString.call(thing) === '[object Function]'
	}
	function extend(optional, base){
		for(var prop in optional){
			if(!base[prop] && optional.hasOwnProperty(prop)){
				base[prop] = optional[prop]
			}
		}
	}
	function throttle(fn, interval){
		var stamp = Date.now()
		return function(){
			if(Date.now() - stamp > (interval || 800)){
				fn.apply(this, arguments)
				stamp = Date.now()
			}
		}
	}
	function touch(el){
		el = typeof el === 'string' ? document.querySelector(el) : el
		if(!el) throw 'touch element not found'
		return new Touch(el)
	}
	function cssAnimate(node, parent, klass, cb){
		node.classList.add(klass)
		parent.appendChild(node)
		node.addEventListener('webkitAnimationEnd', function clearAnimation(event){
			this.removeEventListener('webkitAnimationEnd', clearAnimation)
			if(cb && isFunc(cb)){
				cb()
			}
		})
	}
    //Event.js
    
    var Event = (function(){
        function Event(){
					this.events = {}
        }
        
        Event.prototype = {
					_emit: function(type, event){
						var callbacks = this.events[type],
								self = this
								
						if(!callbacks) return
						callbacks.map(function(cb){
							cb.call(self, event)
						})
					},
					on: function(type, cb){
						if(this.events[type] === undefined) {
							this.events[type] = [cb]
						}
						else{
							this.events[type].push(cb)
						}
						return this
					},
					off: function(type, cb){
						if (!this.events[type]) return
						if(!cb) this.events[type] = []
												
						this.events[type] = this.events[type].filter(function(fn){
							return fn !== cb
						})
					}
				}
				return Event
    })()
	//smooth.js

	function Smooth(el, options){
		Event.apply(this)
		
		this.el = el
		this.index = -1
		this.options = options || {}
		this.methods = options.methods || {}
		this.animations = options.animations || {}
		this.stages = []
		this._init()
	}

	Smooth.prototype = {
		_init: function(){
			var rawStage = this.el.querySelectorAll('.stage'),
					self = this
			
			this.images = this.el.querySelectorAll('img')
			makeArray(rawStage).map(function(raw){
				var stage = self.el.removeChild(raw)
				self.stages.push(new Stage(stage))
			})

			this._bindDOMEvents()
			this.on('ready', function(e){
				this.el.classList.add('show')
				this._load(this.stages[0])
			})
			if(this.el.getAttribute('resource')){
				this.getResource()
			}
			else{
				setTimeout(function(){
					self._emit('ready')
				}, 60)
			}
		},
		getResource: function(){
			var images = this.images,
			    progress = 0,
			    self = this
			
			if(images.length < 1){
				setTimeout(function(){
					self._emit('ready')
				}, 60)
			}
			
			makeArray(images).map(function(img){
				var src = img.dataset.src
				if(src){
					img.onerror = img.onload = function(e){
						self._emit('progress', {
							current: ++progress,
							total: images.length
						})
						if(progress >= images.length){
							setTimeout(function(){
								self._emit('ready')
							}, 60)
						}
						img.onload = null; img = null
					}
					img.src = src
				}
			})
		},

		_bindDOMEvents: function(){
			touch(this.el)
				.on('swipe', throttle(this.delegateSwipe.bind(this)))
				.on('tap', throttle(this.delegateTap.bind(this)))
		},
		
		delegateSwipe: function(event){
			var direction = this.el.getAttribute('direction') || 'vertical'

			if(direction === 'vertical' && (event.direction === 0 || event.direction === 2)) return
			if(direction === 'horizontal' && (event.direction === 1 || event.direction === 3)) return

			if(event.direction === 2 || event.direction === 3){
				var next = this.index + 1
			}
			else{
				next = this.index - 1
			}
		    this._load(this.stages[next])
		},

		delegateTap: function(event){
			var stage = this.stages[this.index],
			    possibleAnchor = event.target.getAttribute('anchor'),
			    possibleHandler = event.target.getAttribute('ontap')

			if(possibleHandler && isFunc(this.methods[possibleHandler])){
				this.methods[possibleHandler].call(this, event, stage)
			}
			else if(!possibleHandler && possibleAnchor){
				this._load(this.stages[possibleAnchor])
			}
			else if(!possibleAnchor){
				if(!stage.next()){
					this._load(this.stages[this.index + 1])
				}
			}
		},

		_load: function(stage){			
			if(!(stage instanceof Stage)) return

			var nextIndex = this.stages.indexOf(stage),
				currentStage = this.stages[this.index],
				animation = this.el.getAttribute('transition') || 'bottomExpandIn',
				klass = nextIndex > this.index ? animation : animation + 'Reverse'
				self = this
				
			cssAnimate(stage.el, this.el, klass, function(){
				try{self.el.removeChild(currentStage.el)}catch(e){}
				if(!stage.played){
					stage.blocs.map(function(bloc){
						var delay = bloc.el.getAttribute('delay') || 0
						if(bloc.now === 'now'){
							var clock = setTimeout(function(){								
								//check javascript animation first
								var possibleJSAnimation = self.animations[bloc.animation]

								if(possibleJSAnimation && isFunc(possibleJSAnimation)){
									possibleJSAnimation.call(self, bloc.el, stage.el)
								}else{
									//no js animation provided, use CSS instead
									cssAnimate(bloc.el, stage.el, bloc.animation, function(){
										bloc.el.classList.remove(bloc.animation)
										clearTimeout(clock)
									})
								}
							}, delay)
						}
					})
					stage.played = true
				}
				stage.el.classList.remove(klass)
			})
			this.index = nextIndex
		},

		flow: function(){
			var currentStage = this.stages[this.index]

			if(!currentStage.next()){
				this.goto(this.stages[this.index + 1])
			}
		}
	}
	extend(Event.prototype, Smooth.prototype)    
	Smooth.prototype.goto = Smooth.prototype._load

	function Stage(el){
		this.el = el
		this.played = false
		this.blocs = []
		this.currentBloc = 0
		this._init()
	}
	Stage.prototype = {
		_init: function(){
			var self = this,
					rawBlocs = this.el.querySelectorAll('.bloc')

			makeArray(rawBlocs).map(function(raw){
				var animation = raw.getAttribute('animation') || 'expandIn',
						now = raw.getAttribute('now')

				self.blocs.push({
					el: self.el.removeChild(raw),
					now: now,
					animation: animation
				})
			})
		},

		next: function(){
			var currentBloc = this.blocs.filter(function(bloc){
				    return bloc.now !== 'now'
			    })[this.currentBloc],
			    self = this

			if(currentBloc){
				cssAnimate(currentBloc.el, this.el, currentBloc.animation, function(){
					currentBloc.el.classList.remove(currentBloc.animation)
					self.currentBloc++
				})
				return true
			}
			return false
		}
	}

	//Touch.js

	var Touch = (function(){
		var TAP_DURATION = 200,
		    TAP_DISTANCE = 30
		
		function getDistance(x0, y0){
			return Math.sqrt(x0 * x0 + y0 * y0)
		}
		function getDirection(x1, x2, y1, y2) {
			return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 2 : 0) : (y1 - y2 > 0 ? 3 : 1)
		}

		function Touch(el){
			Event.apply(this)
			this.el = el
			this._init()
		}
		
		Touch.prototype = {
			_init: function(){
				this.el.addEventListener('touchstart', this._start.bind(this))
				this.el.addEventListener('touchend', this._end.bind(this))
			},
			_start: function(event){
				var pointer = event.touches[0]

				this.then = Date.now()
				this.x0 = pointer.pageX
				this.y0 = pointer.pageY
			},
			_end: function(event){
				var pointer = event.changedTouches[0]

				event.duration = Date.now() - this.then 
				event.endX = pointer.pageX
				event.endY = pointer.pageY

				var dX = event.endX - this.x0,
						dY = event.endY - this.y0

				event.distance = getDistance(dX, dY)

				if(event.duration < TAP_DURATION && event.distance <= TAP_DISTANCE){
					this._emit('tap', event)
				}
				else if(event.distance > TAP_DISTANCE){
					event.direction = getDirection(this.x0, event.endX, this.y0, event.endY)
					this._emit('swipe', event)
				}
			}
		}
		extend(Event.prototype, Touch.prototype)
		
		return Touch
	})()

	//expose some utilities
	Smooth.animate = cssAnimate
	Smooth.touch = touch

	//expose Smooth to global
	return Smooth
})
},{}]},{},[1]);
