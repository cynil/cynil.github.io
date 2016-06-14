
//Initializing, remove loading page
U.addEvent(window, 'load', function(event){
	var elapsed = Date.now() - then
		timer  = null;

	if(elapsed < 600){
		//如果很快就加载好了，那么应该多等一会儿，保证一致性
		//不然的话，loading页面会一闪而过。
		U.$('#loading').className = 'fadeout-slowly';				
	}else{
		U.$('#loading').className = 'fadeout';						
	}
	
	U.addEvent(U.$('#loading'), 'animationend', function(e){
		document.body.removeChild(this);
		console.log(this);
	});

});

//鼠标滚轮，方向键，PageDown/PageUp键只触发翻页运动，不涉及页内运动。
//页内添加一个炫酷的按钮控制PPT进度。

(function enablePageSlider(U){

})(U);

//enable presentation effects;
(function enablePPTCommands(U){
/*
	var i = 0,
		h = document.documentElement.clientHeight;

	U.addEvent(U.$('.main-wrapper'), 'click', function(event){

		this.style.top = (--i * h) + 'px';
		console.log(i * h);
	});
	*/
})(U);
















