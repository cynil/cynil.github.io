var marked = (function customMarked(){

    return marked
})()

angular.module('marked', [])
    .filter('marked', function(){
        return function(value){}
    })