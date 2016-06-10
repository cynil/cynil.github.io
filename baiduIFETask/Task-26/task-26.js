/*
 *Utils Module OK
 *Modified 2016/6/8 21:06
 */
var U = {
	$: function(s){
		return document.getElementById(s)
	},
	
	calcTop: function(el, orbit){
		//10 => half of el's height, we want el to be placed right at the center of its orbit.
		return U.$('orbit-' + orbit).offsetTop - 10;
	},
    calcOrigin: function(el, orbit){
		/* caculate transform-origin-y
		 * el should rotate around the planet, which is 
		 * positoned right at the center of the universe element in our stylesheet.
		 * clientHeight/2 help us find the center point
		 */
		return U.$('universe').clientHeight / 2 - U.calcTop(el, orbit);
	},

	calcRadius: function(el, orbit){
		return U.calcOrigin(el, orbit) - 10;
	},

	setttleDOM: function(options){
		var dom = options.dom;
		var orbit = options.orbit;

		dom.style.top = U.calcTop(dom, orbit) +'px';
		dom.style.transformOrigin = '50% ' + U.calcOrigin(dom, orbit) + 'px';
		dom.radius = U.calcRadius(dom, orbit);
	},
	setBatteryStatus: function(el){
		var width = parseFloat(el.style.width);

		if( width > 0 && width < 40){
			el.className = 'battery-low';
		}else if(width >= 40 && width < 80){
			el.className = 'battery-mid';
		}else{
			el.className = 'battery-high';
		}
	}
};


//GLOBAL CONSTANTS

var MAX_ENERGY = 100, //%
	ENERGY_CHARGE_UNIT = 2, //%
	ENERGY_CONSUME_UNIT = 5, //%
	COMMAND_LOST_RATE = 0.3, //rate

	SPEED = 10, //px
	STEP = 1000 / 60, //ms, animation step	
	WAIT = 1000; //ms

/*
 *Spaceship Module
 *Created 2016/6/1 09:23
 */

function Spaceship(id, orbit){
	this.remainEnegy = MAX_ENERGY;
	this.status = 'stopped';
	this.id = id;
	this.orbit = orbit;
	this.timer = null;

	this.init();
}

Spaceship.prototype.init = function(){
	//here we just declare attributes, and let the Commander.create() method to do other things.
	this.battery = document.createElement('div');
	this.battery.className ='battery-high';

	this.label = document.createElement('span');
	this.label.className = 'ship-label';

	this.dom = document.createElement('div');
	this.dom.className = 'sp';

	this.dom.appendChild(this.label);
	this.dom.appendChild(this.battery);

	this.battery.style.width = this.remainEnegy + '%';

	this.power().charge(ENERGY_CHARGE_UNIT);
};

//Engine System OK
//2016/6/1 10:23
Spaceship.prototype.engine = function(){
	var that = this;

	return {
		fly: function(unit){

			if(that.remainEnegy < ENERGY_CONSUME_UNIT){
				return;
			}else{

				if(that.status == 'stopped'){
					DOMManipulator.activate(that.dom);
				}

				that.status = 'flying';

				if(!that.timer) that.timer = setInterval(function(){
					if(that.remainEnegy <= ENERGY_CONSUME_UNIT){
						that.engine().stop();
					}else{
						that.remainEnegy -= unit;
					}

					U.setBatteryStatus(that.battery);
					that.battery.style.width = that.remainEnegy + '%';
				}, 1000);
			}
		},
		stop: function(){
			
			clearInterval(that.timer);
			that.timer = null;
			DOMManipulator.freeze(that.dom);
			that.status = 'stopped';
		}
	}
};

//Power System OK
//2016/6/1 11:04
Spaceship.prototype.power = function(){

	var that = this,
		timer;
	return {
		charge: function(unit){
			timer = setInterval(function(){
				if(that.remainEnegy < MAX_ENERGY){
					that.remainEnegy += unit;
				}else{
					that.remainEnegy = MAX_ENERGY;
				}
				
				U.setBatteryStatus(that.battery);	
				that.battery.style.width = that.remainEnegy + '%';

			}, 1000);
		}
	}
};

//Singnal System OK
//2016/6/1 13:44
Spaceship.prototype.receiveCommand = function(cmd){
	if(cmd.id != this.id){
		return false;
	}
	switch (cmd.command){
		case 'fly':
			this.engine().fly(ENERGY_CONSUME_UNIT);
			break;
		case 'stop':
			this.engine().stop();
			break;
		case 'destory':
			this.destory();
			break;
	}
	return true;
}

//Demolition System OK
//2016/6/5 10:45
Spaceship.prototype.destory = function(){

	DOMManipulator.unregister(this.dom);
	this.dom.parentNode.removeChild(this.dom);
    Mediator.unregister(this.id);
}


/*
 *Commander Module
 *Modified 2016/6/10 22:08
 */

var Commander = {

	guid: 0,

	command: function(cmd){
		
		Panel.log('Command ' + cmd.command.toUpperCase() + ' to Ship ' + cmd.id + ' start Sending.');
		Mediator.exec(cmd);
	},
	/*create command should not send via Mediator, as you can't make order to a non-exsit ship;
     *our user should be able to set orbit when creating spaceships，but the id should be managed 
     *and distributed by commander to ensure data sharing among modules.
     */
	create: function(orbit){

		var sp = new Spaceship(++this.guid, orbit);

		sp.label.innerHTML = 'Ship ' + sp.id;
		
		U.$('universe').appendChild(sp.dom);
		
		U.setttleDOM({
			dom: sp.dom,
			orbit: orbit
		});

		Mediator.register(sp);
		Panel.log('Command CREATE on Orbit ' + orbit + ' Successed.');

		return sp.id;
	}
}


/*
 *Mediator Module
 *Created 2016/6/2 23:34
 */

var Mediator = {
	spaceships: {},

	register: function(sp){
		this.spaceships[sp.id] = sp;
	},

	unregister: function(id){
		delete this.spaceships[id];
		return true;
	},

	exec: function(cmd){

		var that = this;

		function send(){
			if(Math.random() < COMMAND_LOST_RATE){

				Panel.warn('Command ' + cmd.command.toUpperCase() + ' to Ship ' + cmd.id + ' Lost.');
				return;
			}else{
				for(var sp in that.spaceships){
					if(that.spaceships[sp].receiveCommand(cmd)){
						Panel.log('Command ' + cmd.command.toUpperCase() + ' to Ship ' + cmd.id + ' Successed.');
					}
				}
			}
		}
		setTimeout(send, 1000);
	}
}


/*
 *DOMManipulator Module
 *Modified 2016/6/5 09:32
 */


var DOMManipulator = (function(){

	var timers = {},
		degs = {},
		guid = 0;
	return {
		activate: function(dom){
			if(!dom.guid){
				dom.guid = ++guid;
				degs[dom.guid] = 0;
			}

			timers[dom.guid] = setInterval(function(){
				// SPEED is defined in pixels, but we can only Manipulate transform by degs, so here we change it to degs.
				degs[dom.guid] += (SPEED / (dom.radius * Math.PI * 2)) * (180 / Math.PI);
				if(degs[dom.guid] >= 360){
					degs[dom.guid] = 0;
				}
				dom.style.transform = 'rotate(' + degs[dom.guid] + 'deg)';
			},STEP);
		},
		freeze: function(dom){
			clearInterval(timers[dom.guid]);
		},
		unregister: function(dom){
			if(timers[dom.guid]) {
				delete timers[dom.guid];
				delete degs[dom.guid];

				return true;
			}
			return false;
		}
	};
})();


/*
 *Logbook Module
 *Modified 2016/6/4 21:32
 */


var Panel = (function(){

	var dom = document.getElementById('log');
	var ul = document.createElement('ul');
	dom.appendChild(ul);
	ul.innerHTML = '<li id="log-header">LogBook<span id="clear-log">Clear Log</span></li>';

	function addLog(type, msg){
		var li = document.createElement('li');
		li.className = 'log-' + type;

		var clock = new Date();
		var timeStamp = ([clock.getHours(), clock.getMinutes(), clock.getSeconds()]).map(function(v){
			return v < 10 ? '0' + v : v;
		}).join(':');

		li.innerHTML = '<span class="log-stamp">' + timeStamp + '</span>' + msg;

		if(ul.childNodes.length < 2){
			ul.appendChild(li);
		}else{
			ul.insertBefore(li, ul.firstChild.nextSibling);
		}
	}
	return {
		warn: function(msg){
			addLog('warn', msg);
		},
		log: function(msg){
			addLog('log', msg);
		},
		clear:function(){
			ul.innerHTML = '<li id="log-header">LogBook<span id="clear-log">Clear Log</span></li>';
		},
	}
})();


/*
 *Evnets Binding Module
 *Created 2016/6/8 22:01
 */
U.$('create').addEventListener('click', function(){
    var newShipID = Commander.create(U.$('choose-orbit').value.trim());
    U.$('ship-list').innerHTML += '<li class="ship-control" data-ship="' + newShipID + '">'  + 
    													  '<span>' + newShipID + '号控制</span>' +
                                                          '<button data-command="fly">FLY</button>' + 
                                                          '<button data-command="stop">STOP</button>' + 
                                                          '<button data-command="destory">DESTORY</button>' + 
                                  '</li>';
});

U.$('ship-list').addEventListener('click', function(e){
	if(event.target.nodeName.toLowerCase() == 'button'){
		var myShipID = event.target.parentNode.dataset.ship;
		var command = event.target.dataset.command;
		
		Commander.command({
			id: myShipID,
			command: command
        });
        if(command == 'destory'){
            this.removeChild(event.target.parentNode);
        }
    }
});

U.$('log').addEventListener('click',function(e){
	if(e.target.id == 'clear-log'){
		Panel.clear();
	}
});