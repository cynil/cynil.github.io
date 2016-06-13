
//Initializing, remove loading page
U.addEvent(window, 'load', function(event){
	var elapsed = Date.now() - then;

	if(elapsed < 600){
		//如果很快就加载好了，那么应该多等一会儿，保证一致性
		//不然的话，loading页面会一闪而过。
		U.$('#loading').className = 'fadeout-slowly';				
	}else{
		U.$('#loading').className = 'fadeout';						
	}
	
	U.addEvent(U.$('#loading'), 'animationend', function(e){
		document.body.removeChild(this);
	});
});

//
(function enablePageSplit(U){
	
})(U);

//enable presentation effects;
(function enablePPTCommand(U){

})(u);







