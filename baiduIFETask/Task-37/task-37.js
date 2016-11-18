/* 
 * 2016/4/11
 *Total Rewrite : 2016/6/10
 */
 //U import from Utils.js
U.centering = function(o){
		var w = parseInt(getComputedStyle(o).width),
			h = parseInt(getComputedStyle(o).height),
			dW = document.documentElement.clientWidth,
			dH = document.documentElement.clientHeight;

		o.style.left = (dW - w)/2 + 'px';
		o.style.top = (2 * document.body.scrollTop + dH - h)/2 + 'px';
}

;(function(window, document){
	function Popup(title, msg, cancelBtn, callback){
		this.title = title;
		this.msg = msg;
		this.cancelBtn = cancelBtn || false;
		this.callback = callback || U.emptyFunc;
		this._init();
	};
	Popup.prototype = {
		_init: function(){
			var self = this,
				dom = '<div id="pop-mask"></div>' + 
					  '<div id="pop-wrap">' + 
						  '<div id="pop-title">' + this.title + '</div>' + 
						  '<div id="pop-content">' + this.msg + '</div>' +
						  '<div id="pop-footer">' + 
						      '<button id="pop-sure">Sure</button>' + 
						  '</div>' + 
					  '</div>';
			this.el = document.createElement('div');
			this.el.className = 'pop';
			this.el.innerHTML = dom;
			this._fadeIn();

			//Centering
			U.centering(U.$('#pop-wrap'));
			window.addEventListener('resize', function(){
				U.centering(U.$('#pop-wrap'));
			});
			//Draggable
			U.$('#pop-wrap').addEventListener('mousedown', function(){
				var x = event.clientX,
					y = event.clientY,
					l = parseInt(window.getComputedStyle(this).left),
					t = parseInt(window.getComputedStyle(this).top);

				function getPosition(){
					U.$('#pop-wrap').style.left = (l + event.clientX - x) + 'px';
					U.$('#pop-wrap').style.top = (t + event.clientY - y) + 'px';
				}
				this.addEventListener('mousemove', getPosition);
				this.addEventListener('mouseup', function(){
					this.removeEventListener('mousemove', getPosition);
				});
			});

			//Click

			U.$('#pop-sure').addEventListener('click', function(){
				self._close(true);
			});
			if(this.cancelBtn){
				//重写一次innerHTML会把所有事件清除，就算是原来有的也会清除。
				var popCanel = document.createElement('button');

				popCanel.innerHTML = 'Cancel';
				popCanel.id = 'pop-cancel';
				U.$('#pop-footer').appendChild(popCanel);
				U.$('#pop-cancel').addEventListener('click', function(){
					self._close(false);
				});
			}
		},

		_fadeIn: function(){
			var self = this;

			document.body.appendChild(this.el);
			setTimeout(function(){				
				self.el.style.opacity = 1;
			}, 0);//nice trick:-)

		},

		_fadeOut: function(){
			var self = this;

			this.el.style.opacity = 0;
			setTimeout(function(){
				document.body.removeChild(self.el);
			}, 650);
		},

		_close: function(sure){
			this.callback(sure);
			this._fadeOut();
		}
	};

	window.POP = {
		//Popup(title, msg, cancelBtn, callback)
		alert: function(msg, title){
			if(!title) title = 'ALERT'
			return new Popup(title, msg, false, null)
		},
		confirm: function(msg, callback, title){
			if(!title) title = 'CONFIRM'
			return new Popup(title, msg, true, callback || null)
		},
	}
})(window, document);