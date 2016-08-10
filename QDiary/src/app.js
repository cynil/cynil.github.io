var QDiary = angular.module('QDiary', ['ngRoute', 'myFilters', 'myServices', 'simpleStorage'])

QDiary
    .config(function DiaryRouteConfig($routeProvider){
        $routeProvider
            .when('/', {
                controller: 'MainController',
                templateUrl: 'templates/default.tmpl.html'
            })
            .when('/view/:guid', {
                controller: 'DetailController',
                templateUrl: 'templates/detail.tmpl.html'
            })
            .when('/edit/:guid',{
                controller: 'EditController',
                templateUrl: 'templates/edit.tmpl.html'
            })
            .when('/new/', {
                controller: 'NewController',
                templateUrl: 'templates/edit.tmpl.html'
            })
            .otherwise({
                redirectTo: '/'
            })
    })

    .run(function($rootScope, $location, DiaryService, $getItemByGuid){

        $rootScope.diaries = DiaryService.query()
        
        $rootScope.diaries.forEach(function(v){
            if(v.status === undefined){
                v.status = false
            }
        })

        $rootScope.$on('$routeChangeSuccess', function(evt){
            var bread = $location.url().split('/').filter(function(v){
                return v !== ''
            })

            if(bread[1]){
                try{
                    bread[1] = $rootScope.diaries[$getItemByGuid(bread[1], $rootScope.diaries)]['title']
                }catch(e){}
            }

            $rootScope.breadcrumb = ['Home'].concat(bread)
        })

    })

    .controller('MainController', function($rootScope, $location, $myStorage, DiaryService){

        if(!$myStorage.simple('used')){
            var date = new Date().toLocaleString();
            var welcome = {
                title: 'Welcome!',
                date: date,
                contents: [
                    'Thank you for using QDiary!',
                    'QDiary is a lightweight diary web application build with AngularJS and Bootstrap.',
                    'It is very safe and convenient, As it is backend-less -- all of its data are stored in your own computer\'s localStorage, and it is available event when youare offline',
                    'Enjoy your time with writing diaries!'
                    ]
            }

            welcome.guid = DiaryService.save(welcome)

            $rootScope.diaries.push(welcome)

            $myStorage.simple('used', 'used')

            $location.path('/view/' + welcome.guid)

        }

        $rootScope.add = function(){
            $location.path('/new/')
        }
    })

    .controller('SidebarController', function($scope, $rootScope, DiaryService, $location, $timeout){
        $scope.showMe = false

        $scope.delete = function(){
            if($scope.showMe === true){
                $rootScope.diaries = $rootScope.diaries.filter(function(v){
                    if(v.status === true){
                        DiaryService['delete'](v)
                        return false
                    }else if(v.status === false){
                        return true
                    }
                })

                $location.path('/')

                $timeout(function(){
                    $scope.showMe = false
                },0)

            }else{
                $scope.showMe = !$scope.showMe
            }
        }

        $scope.deleteAll = function(){
            $rootScope.diaries = []

            DiaryService.erase()

            $location.path('/')
        }
    })

    .controller('DetailController', function($scope, $rootScope, $routeParams, $location, $getItemByGuid, DiaryService){

        var key = $getItemByGuid($routeParams.guid, $rootScope.diaries)

        if(key === undefined){
            $location.path('/')
        }

        $scope.diary = $rootScope.diaries[key]

        $scope['delete'] = function(){
            $rootScope.diaries.splice(key, 1)
            DiaryService['delete']($scope.diary)

            var next = $rootScope.diaries[key] ? $rootScope.diaries[key] : 0

            if(next){
                $location.path('/view/' + next.guid)
            }else{
                $location.path('/')
            }
        }
        
    })

    .controller('EditController', function($scope, $rootScope, $routeParams, $location, $getItemByGuid, DiaryService){

        var key = $getItemByGuid($routeParams.guid, $rootScope.diaries)

        if(key === undefined){
            $location.path('/')
        }

        $scope.diary = $rootScope.diaries[key]
        $scope.rawContents = $scope.diary.contents.join('\n')

        $scope.saveItem = function(){
            var item = {
                title: $scope.diary.title,
                date: $scope.diary.date,
                contents: $scope.rawContents.split('\n'),
                guid: $scope.diary.guid
            }

            DiaryService.save(item)
            
            $rootScope.diaries[key] = item

            $location.path('/view/' + item.guid)
        }
    })

    .controller('NewController', function($scope, $rootScope, $location, DiaryService){
        $scope.rawContents = ''
        $scope.saveItem = function(){
            var date = new Date().toLocaleString()
            var item = {
                title: $scope.diary.title,
                date: date,
                contents: $scope.rawContents.split('\n')
            }

            item.guid = DiaryService.save(item)

            $rootScope.diaries.push(item)

            $location.path('/view/' + item.guid)
        }
    })


/*
 *
 * Filters
 * 
 */
angular.module('myFilters', [])
    .filter('hideExtra', function(){
        return function(value, limit){
            return value.length>limit ? value.substr(0, limit) + '...' : value
        }
    })

/*
 *
 * Services
 * 
 */
angular.module('myServices', ['simpleStorage'])

    .factory('$getItemByGuid', function(){
        return function(key, list){
            for(var i = 0; i < list.length; i++){
                if(list[i]['guid'] === key){
                    return i
                }
            }
        }
    })

    .factory('DiaryService', function($myStorage){

        var db = $myStorage.open('diaries')

        return {
            query: function(){
                return db.query()
            },

            save: function(item){
                //status是标志是否被删除按钮选中的，临时生成，所以不需要存储
                if(item.status){
                    delete item.status
                }

                if(!item.guid || item.guid.indexOf('diaries') < 0){
                    return db.create(item)
                }else{
                    return db.update(item)
                }
            },

            'delete': function(item){
                return db['delete'](item)
            },

            erase: function(){
                var all = db.query()

                for(var i in all){
                    db['delete'](all[i])
                }                
            }
        }
    })

/*
 *
 * 
 * mock data for tests
 * 
 * 
 * */
function mock(n){

    localStorage.clear()

    var item, cnt = 0

    for(var i = 0; i < n; i++){
        item = {
            title: 'diary-' + cnt,
            date: new Date().toLocaleString(),
            contents: genContents(Math.floor(Math.random()*6) + 4),
            guid: 'diaries' + new Date().getTime()
        }

        localStorage[item.guid] = JSON.stringify(item)

        cnt += 1
    }
}

function genContents(m){
    var result = []
    for(var i = 0; i < m; i++){
        result[i] = ''
        for(var j = 0, len = Math.random() * 60 + 20; j < len; j++){
            result[i] += String.fromCharCode(Math.floor(Math.random() * 58) + 65)
        }
    }

    return result
}