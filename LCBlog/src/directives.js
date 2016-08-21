angular.module('leanBlog.directives', [])

    .directive('leanAnimate', function(){
        return {

            restrict: 'EA',

            compile: function(element, attrs, transcludeFn){

                var animatingClass = attrs.leanAnimate

                element.addClass(animatingClass)

                return function postLink(scope, element, attrs){

                    element.bind('animationend', function(event){
                        element.removeClass(animatingClass)
                    })

                }
            }
        }
    })

    .directive('sidebar', function(){
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: './templates/sidebar.tmpl.html',
            scope: {
                isActive: '=toggleMe'
            },
            link: function(scope, element, attrs){}
        }
    })