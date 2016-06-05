//Utils
var U = {
	$: function(s){
		return document.getElementById(s)
	},
	calcOrigin: function(el){
		return (U.$('universe').clientHeight / 2 - el.offsetTop) + 'px';
	},
	calcTop: function(el){
		return (U.$('orbit-' + el.id.split('-')[1]).offsetTop - 10) + 'px';
	},
	calcRadius: function(el){
		return parseInt(U.calcOrigin(el)) - parseInt(U.calcTop(el)) - 10
	}
};


/*
每个飞船由以下部分组成:
1.动力系统，可以完成飞行和停止飞行两个行为，暂定所有飞船的动力系统飞行速度是一致的，比如每秒20px，飞行过程中会按照一定速率消耗能源（比如每秒减5%）
2.能源系统，提供能源，并且在宇宙中通过太阳能充电（比如每秒增加2%，具体速率自定）
3.信号接收处理系统，用于接收行星上的信号
4.自爆系统，用于自我销毁
每个飞船的能源是有限的，用一个属性来表示能源剩余量，这是一个百分比，表示还剩余多少能源。
能源耗尽时，飞船会自动停止飞行
飞船有两个状态：飞行中和停止，飞船的行为会改变这个属性状态
飞船的自我销毁方法会立即销毁飞船自身
*/

/*
 *Spaceship Module
 */
var MAX_ENERGY = 100, //%
	ENERGY_CHARGE_UNIT = 2, //%
	ENERGY_CONSUME_UNIT = 5, //%
	COMMAND_LOST_RATE = 0.3, //rate

	SPEED = 5, //px
	STEP = 1000 / 60, //ms, animation step	
	WAIT = 1000; //ms

function Spaceship(id, dom){
	this.remainEnegy = MAX_ENERGY;
	this.status = 'stopped';
	this.id = id;
	this.dom = dom;
	this.timer = null;
	this.dom.innerHTML = this.remainEnegy + '%';

	this.power().charge(ENERGY_CHARGE_UNIT);
}

//动力系统 OK
Spaceship.prototype.engine = function(){
	var that = this;

	return {
		fly: function(unit){

			if(that.timer) that.timer = null;

			if(that.remainEnegy < ENERGY_CONSUME_UNIT){
				return;
			}else{
				if(that.status == 'stopped'){
					DOMManupulator.activate(that.dom);
				}

				that.status = 'flying';

				that.timer = setInterval(function(){
					if(that.remainEnegy < ENERGY_CONSUME_UNIT){
						that.engine().stop();
					}else{
						that.remainEnegy -= unit;
					}

					that.dom.innerHTML = (that.remainEnegy < 0 ? 0 : that.remainEnegy) + '%';
				}, 1000);
			}
		},
		stop: function(){
			
			clearInterval(that.timer);
			that.timer = null;
			DOMManupulator.freeze(that.dom);
			that.status = 'stopped';
		}
	}
};
//
Spaceship.prototype.power = function(){

	var that = this,
		timer = null;
	return {
		charge: function(unit){
			timer = setInterval(function(){
				if(that.remainEnegy < MAX_ENERGY){
					that.remainEnegy += unit;
				}else{
					that.remainEnegy = MAX_ENERGY;
				}
					
				that.dom.innerHTML = that.remainEnegy + '%';

			}, 1000);
		}
	}
};

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

Spaceship.prototype.destory = function(){

	Mediator.unregister(this.id);
	this.dom.style.display = 'none';

}
/*
指挥官可以通过行星上的信号发射器发布如下命令
1.创建一个新的飞船进入轨道，最多可以创建4个飞船，刚被创建的飞船会停留在某一个轨道上静止不动
2.命令某个飞船开始飞行，飞行后飞船会围绕行星做环绕运动，需要模拟出这个动画效果
3.命令某个飞船停止飞行
4.命令某个飞船销毁，销毁后飞船消失、飞船标示可以用于下次新创建的飞船
你需要设计类似如下指令格式的数据格式
	{
		id: 1,
		command: 'stop'
	}
*/

var Commander = {

	spaceships: {},

	command: function(cmd){
		Mediator.exec(cmd);
		//Panel.log('Command ' + cmd.command.toUpperCase() + ' to Ship ' + cmd.id + ' start Sending.');
	},
}

/*
指挥官通过信号发射器发出的命令是通过一种叫做Mediator的介质进行广播
Mediator是单向传播的，只能从行星发射到宇宙中，在发射过程中，有30%的信息传送失败（丢包）概率，你需要模拟这个丢包率，另外每次信息正常传送的时间需要1秒
指挥官并不知道自己的指令是不是真的传给了飞船，飞船的状态他是不知道的，他只能通过自己之前的操作来假设飞船当前的状态
每个飞船通过信号接收器，接受到通过Mediator传达过来的指挥官的广播信号，但因为是广播信号，所以每个飞船能接受到指挥官发出给所有飞船的所有指令，因此需要通过读取信息判断这个指令是不是发给自己的
任务注意事项

指挥官下达销毁飞船指令后，默认在指挥官那里就已经默认这个飞船已经被销毁，但由于有信息传递丢失的可能性，所以存在实际上飞船未收到销毁指令，而指挥官又创建了新的飞船，造成宇宙中的飞船数量多于创建的4个上限。
*/

/*
 *Mediator Module
 */
var Mediator = {
	spaceships: {},

	register: function(id){

		this.spaceships[id] = new Spaceship(id, U.$('sp-' + id));
		this.spaceships[id].dom.style.display = 'block';
		this.spaceships[id].dom.style.top = U.calcTop(this.spaceships[id].dom);
		this.spaceships[id].dom.style.transformOrigin = '50% ' + U.calcOrigin(this.spaceships[id].dom);

	},

	unregister: function(id){
		this.spaceships.splice();
	},

	exec: function(cmd){
		if(Math.random() < COMMAND_LOST_RATE){
			Panel.warn('Command ' + cmd.command.toUpperCase() + ' to Ship ' + cmd.id + ' Lost.');
			return;
		}else{

			if(cmd.command == 'create'){
				if(this.spaceships[cmd.id] instanceof Spaceship){
					Panel.warn('Command CREATE Failed: Already Exist!');					
				}else{
					this.register(cmd.id);
					Panel.log('Command CREATE' + ' to Ship ' + cmd.id + ' Successed.');					
				}

			}else{
				for(var sp in this.spaceships){
					if(this.spaceships[sp].receiveCommand(cmd)){
						Panel.log('Command ' + cmd.command.toUpperCase() + ' to Ship ' + cmd.id + ' Successed.');
					}
				}
			}

		}
	},
	destory: function(id){
		this.spaceships.splice(id,1);
	}
}

/*
 *Logbook Module
 *Modified 6/4/2016 21:32
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
		}
	}
})();


/*
 *DOMManupulator Module
 *Modified 6/5/2016 09:32
 */
var DOMManupulator = (function(){

	var timers = {},
		degs = {},
		guid = 0;
	return {
		activate: function(dom){
			if(!dom.guid){
				dom.guid = ++guid;
				degs[dom.guid] = 0
			}

			timers[dom.guid] = setInterval(function(){
				degs[dom.guid] += (SPEED/(U.calcRadius(dom) * Math.PI * 2)) * (180 / Math.PI);
				if(degs[dom.guid] >= 360){
					degs[dom.guid] = 0;
				}
				dom.style.transform = 'rotate(' + degs[dom.guid] + 'deg)';
			},STEP);
		},
		freeze: function(dom){
			clearInterval(timers[dom.guid]);
		},
	};
})();
