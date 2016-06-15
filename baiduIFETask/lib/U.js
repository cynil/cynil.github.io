/*My Utils Library 
 *Created By cYnii
 *2016/6/12 16:01
 */
window.U = {
	$: function(el){
		try{
			return document.querySelector(el);			
		}catch(e){
			return el.charAt(0) == '#' ? document.getElementById(el.substring(1)) : false;
		}
	},

	serialize: function(o){

		//时间戳防止缓存
		if (o == null) return '_=' + new Date().getTime();

		var ret = [];
		for(var i in o){
			ret.push(i + '=' + o[i]);
		}
		return ret.join('&') + '&_=' + new Date().getTime();
	},
	
	fill: function(optional,base){
		for(var i in base){
			if(optional[i] === undefined){
				optional[i] = base[i];
			}
		}
	},

	emptyFunc: function(){},

	parse: function(template, o){
		//match 如果有g，则返回数组是所有匹配。如果没有g，
		//返回数组第一项是第一个匹配，剩下的是圆括号内每一项。
		var pattern = /\{\{([^\}\{}]+)\}\}/g;		
		return template.replace(pattern, function(all, a){//这里的all,a分别指整个匹配，和第一个小括号
			return o[a];
		});
	},

	addEvent: function(el, type, fn){

		if(window.addEventListener){

			return el.addEventListener(type, fn, false);

		}else if(window.attachEvent){

			return el.attachEvent('on' + type, function(event){
				//attachEvent同时支持event和window.event，但是属性有不同
				//统一起见，使用event，向W3C标准DOM靠近
				event.target = event.srcElement;
				event.preventDefault = function(){
					this.returnValue = false;
				};
				event.stopPropagation = function(){
					this.cancelBubble = true;
				};
				//修补几个常见的，剩下的用到再添加
				//...

				//attachEvent会丢失this。有一点疑虑，这样直接把它挂在el下执行，
				//而原本是在window下执行的。。。
				fn.call(el, event);
			});
		}else{
			return el['on' + type] = function(event){
				//DOM 0级事件，W3C和IE表面上是一样的。但W3C只支持event
				//IE只支持window.event
				if(!event){
					event = window.event;
					event.target = event.srcElement;
					event.preventDefault = function(){
						this.returnValue = false;
					};
					event.stopPropagation = function(){
						this.cancelBubble = true;
					};
				}
				//函数内调用函数也会丢失this
				fn.call(this, event);
			};
		}
	},

	ajax: function(url, options){
		//原则：不支持老浏览器，以后可能支持，但不是现在
		if(!url && !options) return;

		var defaults = { //defaults里面只补全必须项。
			method: 'GET', //必须
			data: null, //必须
			timeout: 3000,
			success: U.emptyFunc //必须
			//override: 可选
			//headers: 可选
			//fail: 可选
		};

		U.fill(options, defaults);

		var data = options.data;

		data = typeof data == 'object' ? U.serialize(data) : data;

		url = options.method.toLowerCase() == 'post' ? url : url + '?' +  data;

		var sendings = options.method.toLowerCase() == 'post' ? data : null;

		var xhr = new XMLHttpRequest();

		xhr.open(options.method.toUpperCase(), url, true);

		//这个要写在前面，因为后面用户可能希望更改x-www-form...
		if(options.method == 'post'){
			xhr.setRequestHeader && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		//可选项
		if(options.headers){
			for(var i in options.headers){
				xhr.setRequestHeader(i, options.headers[i]);
			}
		}
		//可选项
		//resonpeType：不管你返回的是什么数据类型，我只希望浏览器按照我所期望的来解析。
		if(options.override){
			xhr.responseType = options.override;
		}

		xhr.send(sendings);
		
		//即使是失败，（例如目标url不存在）也会触发readyState=4
		//那么onerror又是什么鬼？
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200 || xhr.status == 304){
					options.success(xhr);
				}else{
					options.fail && options.fail(xhr.status, xhr.textStatus, xhr);
				}
			}
		}
	}
}