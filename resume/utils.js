/*Ajax and some other utils
 *Created By cYnii
 *2016/6/12 16:01
 */
var U = {
	$: function(el){
		return document.querySelector(el);
	},
	ajax: function(url, options){
		//原则：不支持老浏览器，以后可能支持，但不是现在
		if(!url && !options) return;

		var defaults = { //defaults里面只补全必须项。
			method: 'GET', //必须
			data: null, //必须
			success: U.emptyFunc, //必须
			//override: 可选
			//headers: 可选
			//fail: 可选
		}

		U.fill(options, defaults);

		var data = options.data;

		data = typeof data == 'object' ? U.serialize(data) : data;

		url = options.method == 'post' ? url : url + '?' +  data;

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
	},
	loadScript: function(url){
		var script = document.createElement('script');
		script.src = url;
		script.onload = function(){
			document.body.appendChild(this);
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
			if(!optional[i]){
				optional[i] = base[i];
			}
		}
	},
	emptyFunc: function(){}
}

/*
U.ajax('main.html', {
	method: 'post',
	data: o,
	headers: {}
	override: 'xml',//你期望的数据格式，想用responsexml就用设置为xml，不管服务器返回的是什么
	success: function(xhr){
		console.log(data);
	},
	fail: function(xhr){
		console.log(status);
	}
});
*/