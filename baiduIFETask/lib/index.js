function tmpl(template, o){
	var pattern = /\{\{([^\}\{}]+)\}\}/g;		
	return template.replace(pattern, function(all, a){
		return o[a]
	})
}

$(document).ready(function(){
	$.ajax('./lib/items.json', {
		type: 'get',
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
		}
	})

	$('#rocket').click(function(e){
		var then = +new Date,
			S = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
			T = 8 * Math.sqrt(S),
			$this = $(this)
		if($this.is(':visible')){
			requestAnimationFrame(function step(){
				var now = +new Date
					p = Math.min(1.0, (now - then)/T)

				window.scrollTo(0, (1 - p) * (1 - p) * S)
				if(p < 1.0){
					requestAnimationFrame(step)
				}else{
					$this.css({visibility: 'hidden'})
				}
			})
		}
	})

	$(window).on('keyup scroll', function(){
		var $rocket = $('#rocket')
		if(document.documentElement.scrollTop + document.body.scrollTop > 0){
			$rocket.css({visibility: 'visible'})
		}else{
			$rocket.css({visibility: 'hidden'})
		}
	})
})