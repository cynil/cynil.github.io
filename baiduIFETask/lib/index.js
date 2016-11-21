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

	$('#rocket').click(function(e){
		var then = +new Date,
			S = document.documentElement.scrollTop,
			T = 8 * Math.sqrt(S),
			self = this
		requestAnimationFrame(function step(){
			var now = +new Date
				p = Math.min(1.0, (now - then)/T)

			document.documentElement.scrollTop = (1 - p) * (1 - p) * S
			if(p < 1.0){
				requestAnimationFrame(step)
			}else{
				self.style.visibility = 'hidden'
			}
		})
	})

	function tmpl(template, o){
		var pattern = /\{\{([^\}\{}]+)\}\}/g;		
		return template.replace(pattern, function(all, a){
			return o[a]
		})
	}
})

// ;(function Tohome(window, document){

// 	window.onkeyup = window.onscroll = function(){
// 		//火狐浏览器s始终为0 -_-|||
// 		var s = U.ua('firefox') ? document.documentElement.scrollTop : document.body.scrollTop
// 		if(s > 0){
// 			$widget.style.visibility = 'visible'
// 		}else{
// 			$widget.style.visibility = 'hidden'
// 		}

// 	}

// })(window, document);