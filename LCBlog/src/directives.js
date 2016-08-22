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

    .directive('tab', function(){
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^tabset',
            templateUrl: './templates/tab.tmpl.html',
            scope: {
                topic: '@',
            },
            link: function(scope, element, attrs, tabset){

                if(!tabset){
                    throw new Error('<tab> must be included in a <tabset>!')
                }

                scope.showMe = true

                tabset.addTab(scope)

            }
        }
    })

    .directive('tabset', function(){
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {},
            templateUrl: './templates/tabset.tmpl.html',
            controller: function($scope){

                $scope.tabs = []

                this.addTab = function(tab){
                
                    $scope.tabs.push(tab)

                    if($scope.tabs.length === 1){
                        tab.showMe = true
                    }else{
                        tab.showMe = false
                    }

                }

                $scope.goTo = function(index){
                    $scope.tabs.map(function(v, i){
                        if(index === i){
                            v.showMe = true
                        }else{
                            v.showMe = false
                        }
                    })
                }

            }
        }
    })

    .directive('load', function(){

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: './templates/load.tmpl.html',
            scope: {
                pending: '=',
                completed: '=',
                onloadmore: '&'
            },
            link: function(scope, element, attrs){

            }
        }
        
    })

    .directive('modal', function(){

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: './templates/modal.tmpl.html',
            scope: {
                title: '@',
                message: '@',
                onsure: '&'
            },
            link: function(scope, element, attrs){

            }
        }
        
    })