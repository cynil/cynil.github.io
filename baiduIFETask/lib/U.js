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

	emptyFunc: function(){},
}