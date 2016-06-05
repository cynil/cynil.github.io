/*
 * @zhouLianJian 2016.4.20
 */
Object.prototype.merge = Object.prototype.merge || function(o){
	var current = this;
	for(var prop in o){
		if(o.hasOwnProperty(prop) && !current[prop]){
			current[prop] = o[prop];
		}
	}
	return current;
};

(function(w){
	var Widgets ={
		cube: function(o){
			return new Cube(o);
		},
	}
	var Cube = function(config){
		options = config.merge({
			text: '回主页',
			width: '36px',
			height: '25px',
			right: '40px',
			bottom: '60px'
		});
		var el = document.createElement("div");
		el.innerHTML = '<a href="http://cynil.github.io/">' + options.text + '</a>';
		el.style.width = options.width;
		el.style.height = options.height;
		el.style.cssText = 'position:fixed;padding:4px;border-radius:8px;' + 
							'font-size:20px;background:#88f;' +
							'right:' + options.right + ';bottom:' + options.bottom + ';';
		this.el = el;
		document.body.appendChild(this.el);
		this.el.getElementsByTagName("a")[0].style.cssText = 'text-decoration:none;font-family:"Microsoft yahei";color:#fff;';
		return this;
	}

	w.Widgets = Widgets;
})(window);

Widgets.cube({
	text:'Back to Home',
});
