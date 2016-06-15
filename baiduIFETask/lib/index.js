(function LoadContents(){
	var template = 
					'<li class="work-item clearfix" id={{id}}>' + 
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
					'</li>';

	U.ajax('lib/items.json', {
		success: function(xhr){

			var results = xhr.responseText;

			try{
				results = JSON.parse(results);
			}catch(e){
				U.$('.works-loding').innerHTML = '<strong>加载失败了，您的浏览器可能不支持json</strong>';
				return false;
			}

			U.$('.works').removeChild(U.$('.works').children[0]);

			results.forEach(function(v, i, arr){

				var tmp = document.createElement('div');

				tmp.innerHTML = U.parse(template, v);

				U.$('.works').appendChild(tmp.children[0]);

			});
		},
		fail: function(status, text, xhr){
			
		}
	});
})();






