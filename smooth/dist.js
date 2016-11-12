(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Smooth = require('./smooth.js')

var smooth = document.querySelector('main')
var app = new Smooth(smooth, {
    direction: 'vertical',
    stageAnimation: 'bottomExpandIn',
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
    }
})
},{"./smooth.js":2}],2:[function(require,module,exports){
//smooth.js
//git repository: https://github.com/cynil/smooth.js
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
	function throttle(fn, interval){
		var stamp = Date.now()
		return function(){
			if(Date.now() - stamp > (interval || 800)){
				console.log(Date.now() - stamp)
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
	function getAnchoredBloc(el){
		while(el){
			if(el.classList && el.classList.contains('bloc') && el.getAttribute('anchor')){
				return el
            }
            el = el.parentNode
        }
        return false
    }
	function cssAnimate(node, parent, klass, cb){
		node.classList.add(klass)
		parent.appendChild(node)
		node.addEventListener('animationend', function clearAnimation(event){
			node.classList.remove(klass)
			this.removeEventListener('animationend', clearAnimation)
			if(cb && isFunc(cb)){
				cb()
			}
		})
	}

	//smooth

	function Smooth(el, options){
		this.el = el
		this.options = options || {}
		this.animations = options.animations || {}
		this.stages = []
		this._init()
	}

	Smooth.prototype = {
		constructor: Smooth,
		_init: function(){
			var self = this

			var rawStage = this.el.querySelectorAll('.stage')

			makeArray(rawStage).map(function(raw){
				var stage = self.el.removeChild(raw)
				self.stages.push(new Stage(stage))
			})

			this.el.classList.add('show')
			this._bindEvents()
			this.index = -1
			this._load(this.stages[0])
		},
		_bindEvents: function(){
			touch(document.body)
				.on('swipe', throttle(this.nextStageHandler.bind(this)))
				.on('tap', throttle(this.nextBlocHandler.bind(this)))
		},
		nextStageHandler: function(event){
			if(this.options.direction === 'vertical' && (event.direction === 0 || event.direction === 2)) return
			if(this.options.direction === 'horizontal' && (event.direction === 1 || event.direction === 3)) return

			if(event.direction === 2 || event.direction === 3){
				var next = this.index + 1
			}
			else{
				next = this.index - 1
			}
			if(next === this.stages.length || next === -1) return
			this._load(this.stages[next])
		},

		nextBlocHandler: function(event){
			var stage = this.stages[this.index],
			    possibleAnchoredBloc = getAnchoredBloc(event.target)
			
			if(!possibleAnchoredBloc){
				var currentBloc = stage.blocs.filter(function(bloc){
					return bloc.now !== 'now'
				})[stage.currentBloc]

                //if no more blocs, load next stage
				if(!currentBloc || stage.currentBloc >= stage.blocs.length){
					var next = this.index + 1
					if(next >= this.stages.length) return
					this._load(this.stages[next])
                }else{
					cssAnimate(currentBloc.el, stage.el, currentBloc.animation, function(){
						console.log(currentBloc.el)
						stage.currentBloc++
					})
				}
			}
			else if(possibleAnchoredBloc){
				var anchor = possibleAnchoredBloc.getAttribute('anchor')
				this._load(this.stages[anchor])
            }
		},
		_load: function(stage){
			var nextIndex = this.stages.indexOf(stage),
				forwards =  nextIndex > this.index,
				currentStage = this.stages[this.index],
				animation = this.options.stageAnimation,
				self = this

			if(forwards){
				stage.el.classList.remove(animation + 'Reverse')
				stage.el.classList.add(animation)
			}
			else{
				stage.el.classList.remove(animation)
				stage.el.classList.add(animation + 'Reverse')
			}
			this.el.appendChild(stage.el)
			stage.el.addEventListener('animationend', function clearAnimation(event){
				try{
					self.el.removeChild(currentStage.el)
				}catch(e){}
				if(!stage.played){
					stage.blocs.map(function(bloc, index){
						var delay = bloc.el.getAttribute('delay') || 0
						if(bloc.now === 'now'){
							var clock = setTimeout(function(){								
								//check javascript animation first
								var possibleJSAnimation = self.animations[bloc.animation]

								if(possibleJSAnimation && isFunc(possibleJSAnimation)){
									possibleJSAnimation(bloc.el, stage.el)
                                }else{
                                    //no js animation provided, use CSS instead
									cssAnimate(bloc.el, stage.el, bloc.animation, function(){
										clearTimeout(clock)
									})
								}
							}, delay)
						}
					})
					stage.played = true
				}
				this.removeEventListener('animationend', clearAnimation)
			})

			this.index = nextIndex
		}
	}

	function Stage(el){
		this.el = el
		this.played = false
		this.blocs = []
		this.currentBloc = 0
		this._init()
	}
	Stage.prototype = {
		constructor: Stage,
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
		}
	}

	//Touch.js

	var Touch = (function(){
		var TAP_DURATION = 200

		function getTime(){
			return Date.now()
		}
		function getDistance(x0, y0){
			return Math.sqrt(x0 * x0 + y0 * y0)
		}

		function Touch(el){
			this.el = el
			this.events = {}
			this._init()
		}

		Touch.prototype = {
			constructor: Touch,
			_init: function(){
				this.el.addEventListener('touchstart', this._touchstart.bind(this))
				this.el.addEventListener('touchend', this._touchend.bind(this))
			},
			_emit: function(type, event){
				var callbacks = this.events[type],
					self = this

				if(!callbacks) return
				callbacks.map(function(cb){
					cb.call(self.el, event)
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
			},

			_touchstart: function(event){
				var pointer = event.touches[0]

				this.e = this.e || {}
				this.e.startTime = getTime()
				this.e.startX = pointer.pageX
				this.e.startY = pointer.pageY
			},
			_touchend: function(event){
				var pointer = event.changedTouches[0]

				event.duration = getTime() - this.e.startTime
				event.startX = this.e.startX
				event.startY = this.e.startY
				event.endX = pointer.pageX
				event.endY = pointer.pageY

				var diffX = event.endX - event.startX,
					diffY = event.endY - event.startY

				event.distance = getDistance(diffX, diffY)

				if(event.duration < TAP_DURATION && event.distance <= 15){
					this._emit('tap', event)
				}
				else if(event.duration >= TAP_DURATION / 2 && event.distance > 15){
					var rightWards = diffX > 0,
						downWards = diffY > 0,
						horizontal = Math.abs(diffX) > Math.abs(diffY)

					if(horizontal && rightWards){
						event.direction = 0//east
					}
					else if(!horizontal && downWards){
						event.direction = 1//south
					}
					else if(horizontal && !rightWards){
						event.direction = 2//west
					}
					else if(!horizontal && !downWards){
						event.direction = 3//north
					}
					this._emit('swipe', event)
				}
			}
		}
		return Touch
	})()

	//expose some useful methods
	Smooth.animate = cssAnimate

	//expose Smooth to global
	return Smooth
})
},{}]},{},[1]);
