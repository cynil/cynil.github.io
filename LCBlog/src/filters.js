angular.module('leanBlog.filters', [])
    .filter('marked', function(){
        return function(value){
            return marked(value)
        }
    })