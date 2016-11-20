$(document).ready(function(){
	$.ajax('./lib/items.json', {
		dataType: 'json',
		success: function(data){
			var template =  '<li id={{id}} class="task-item">' + 
								'<div class="item-main">' +
								'<h3 class="item-title">{{title}}</h3>' +
									'<p class="detail"><span>任务描述：</span>{{content}}</p>' +
									'<p class="sign">' +
										'<span class="timeline">{{date}}</span>' + 
										'<span class="demo"><a href="Task-{{id}}">DEMO</a></span>'+
										'<span class="source"><a href="https://github.com/cynil/cynil.github.io/tree/master/baiduIFETask/Task-{{id}}">CODE</a></span>' +
									'</p>' +
								'</div>' +
							'</li>'
			data = data.sort(function(a, b){
				return new Date(b['date']) - new Date(a['date'])
			})
			
			$.each(data, function(index, item){
				var html = tmpl(template, item)
				$('.task-list').append(html)
			})
		},
		error: function(err){}
	})

	function tmpl(template, o){
		var pattern = /\{\{([^\}\{}]+)\}\}/g;		
		return template.replace(pattern, function(all, a){
			return o[a]
		})
	}
})
/*;(function LoadContents(){
	var template =  '<li class="work-item clearfix" id={{id}}>' + 
						'<h3 class="timeline-title">{{date}}</h3>' + 
						'<div class="item-main">' +
						'<h3 class="item-title"><i class="iconfont">&#xe606;</i>{{title}}</h3>' +
							'<p class="detail"><span>任务描述：</span>{{content}}</p>' +
							'<p class="sign">' +
								'<span class="date"><i class="iconfont">&#xe600;</i>{{date}}</span>' +
								'<span class="demo"><a href="Task-{{id}}"><i class="iconfont">&#xe602;</i>DEMO</a></span>'+
								'<span class="source"><a href="https://github.com/cynil/cynil.github.io/tree/master/baiduIFETask/Task-{{id}}"><i class="iconfont">&#xe601;</i>CODE</a></span>' +
							'</p>' +
						'</div>' +
					'</li>'

	//相对路径，不是指js文件所在的路径，而是指引用该js文件的html文档的路径
	
	U.ajax('lib/items.json', {
		firstly: function(){
			var $works = U.$('.works')
				html = '<div class="works-loading"><img src="images/loading.png" alt=""></div>'
			U.appendHTML($works, html);
		},
		success: function(xhr){
			var $works = U.$('.works'),
				results = xhr.responseText
			try{
				results = JSON.parse(results)
			}catch(e){
				U.$('.works-loding').innerHTML = '<strong>加载失败了，您的浏览器可能不支持json</strong>'
				return false
			}
			$works.removeChild($works.children[0])
			results.sort(function(a, b){
				return new Date(b['date']) - new Date(a['date'])
			})
			results.forEach(function(v, i, arr){
				var html = U.parse(template, v)
				U.appendHTML($works, html)
			})
		}
	})
})()

;(function Tohome(window, document){

	var $widget = U.$('#back'),
		h = document.documentElement.clientHeight || document.body.clientHeight

	U.listen($widget, 'click', function(){
		var then = +new Date,
			S = U.ua('firefox') ? document.documentElement.scrollTop : document.body.scrollTop,
			T = 8 * Math.sqrt(S),
			self = this

		requestAnimationFrame(function step(){
			var now = +new Date
				p = Math.min(1.0, (now - then)/T)

			if(U.ua('firefox')){
				document.documentElement.scrollTop = (1 - p) * (1 - p) * S
			}else{
				document.body.scrollTop = (1 - p) * (1 - p) * S
			}

			if(p < 1.0){
				requestAnimationFrame(step)
			}else{
				self.style.visibility = 'hidden'
			}
		})
	})		

	window.onkeyup = window.onscroll = function(){
		//火狐浏览器s始终为0 -_-|||
		var s = U.ua('firefox') ? document.documentElement.scrollTop : document.body.scrollTop
		if(s > 0){
			$widget.style.visibility = 'visible'
		}else{
			$widget.style.visibility = 'hidden'
		}

	}

})(window, document);
*/