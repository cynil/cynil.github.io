var quickDictionary = (function(){

	return function(){
		document.onmouseup = function(){
			X = event.clientX + 20;
			Y = event.clientY + 40;

			if(!(document.getSelection().toString().match(/\w/))) return;
			U.jsonp({
				url: "https://sp1.baidu.com/5b11fzupBgM18t7jm9iCKT-xh_/sensearch/selecttext",
				data: {
					cb: "renderResponse",
					q: U.encode(document.getSelection().toString()),
					_: new Date().getTime()
				},
				success: function(o){
					var span = document.createElement("span");
					document.body.appendChild(span);
					span.className = "popup-span";
		
					span.innerHTML = (o.data.result instanceof(Array)) ? (o.data.result[0].pre + " " + o.data.result[0].cont):(o.data.result);
					span.style.left = X + "px";
					span.style.top = Y + "px";
					setTimeout(function(){
						document.body.removeChild(span);
					}, 1200);
				}
			});
		}	
	}
})();

quickDictionary();

var U = {};

U.jsonp = function(options){
	var url = options.url;
	var data = U.serialize(options.data);

	var script = document.createElement('script');
	document.body.appendChild(script);

	script.src = url + data;

	window[options.data.cb] = options.success;
}

U.serialize = function(o){
	var text = "?";

	for(var i in o){
		if( o.hasOwnProperty(i)){
			text += i + "=" + o[i] + "&";
		}
	}
	return text = text.substr(0,text.length - 1);
}

U.encode = function(string){
	return string.replace(/(^\s*)|(\s*$)/g,"").split(" ").join("+");
}
