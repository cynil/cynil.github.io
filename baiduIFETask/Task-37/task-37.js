var Popup = (function(window, document){
	return {
		alert: function(){},
		confirm: function(){},
		prompt: function(){},
		config: function(){},
	}
})(window, document);











(function(window, document){
	function Popup(type, msg, callback){
		this.type = type;
		this.msg = msg;
		this.callback = callback;
		this.ok = false;
		this.init();
	};

	Popup.prototype = {
		constructor: Popup,
		init: function(){
			//create dom if need
			if(!$("mask")){
				var mask = document.createElement('div'); mask.id = "mask";
				var wrap = document.createElement('div'); wrap.id = "wrap";
				var title = document.createElement('div'); title.id = "title";
				var content = document.createElement('div'); content.id = "content";
				var footer = document.createElement('div'); footer.id = "footer";
				var sure = document.createElement('button'); sure.id = "sure";
				var cancel = document.createElement('button'); cancel.id = "cancel";
				sure.innerHTML = "Sure"; cancel.innerHTML = "Cancel";
				footer.appendChild(sure); footer.appendChild(cancel);
				wrap.appendChild(title); wrap.appendChild(content); wrap.appendChild(footer);
				document.body.appendChild(mask); document.body.appendChild(wrap);
			}

			this.el = $("wrap");
			this.title = $("title");
			this.content = $("content");
			this.cancel = $("cancel");

			if(this.type == "ALERT"){
				this.cancel.style.display = "none";
			}

			this.title.innerHTML = this.type;
			this.content.innerHTML = this.msg;

			var that = this;

			//centering
			centering(this.el);

			window.addEventListener("resize", function(){
				centering(that.el);
			});

			$("sure").addEventListener("click", function(){
				that.ok = true;
				that.close(that.ok);

			});
			$("cancel").addEventListener("click", function(){
				that.ok = false;
				that.close(this.ok);
			});

			//movable

			$("wrap").addEventListener("mousedown", function(){
				var x = event.clientX;
				var y = event.clientY;
				var l = parseInt(window.getComputedStyle(this).left);
				var t = parseInt(window.getComputedStyle(this).top);
				//var timer;

				function getPosition(){
					$("wrap").style.left = (l + event.clientX - x) + "px";
					$("wrap").style.top = (t + event.clientY - y) + "px";
				}

				this.addEventListener("mousemove", getPosition);
				this.addEventListener("mouseup", function(){
					this.removeEventListener("mousemove", getPosition);
				});
			});

			this.el.style.display = "block";
			$("mask").style.display = "block";
		},
		close: function(ok){
			this.el.style.display = "none";
			$("mask").style.display = "none";
			//document.body.removeChild(this.el);
			if(this.callback){
				this.callback.call(this, this.ok);
			}
		},
	};

	function centering(o){
		console.log(o.clientWidth,o.clientHeight);
		var w = parseInt(window.getComputedStyle(o).width);
		var h = parseInt(window.getComputedStyle(o).height);
		o.style.left = (document.documentElement.clientWidth - w)/2 + "px";
		o.style.top = (2 * document.body.scrollTop + document.documentElement.clientHeight - h)/2 + "px";
	}

	var myPop = {
		confirm: function(msg,callback){
			return new Popup("CONFIRM", msg, callback);
		},
		alert: function(msg){
			return new Popup("ALERT", msg);
		},
	};

	window.myPop = myPop;
})(window, document);

function $(sel){
	return document.getElementById(sel);
};