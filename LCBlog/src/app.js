var leanBlog = angular.module('leanBlog', ['ngRoute', 'leanDB', 'leanBlog.directives'])

leanBlog.constant('ITEMS_PER_PAGE', 4)

leanBlog.config(function($routeProvider){
    $routeProvider

    .when('/',{
        templateUrl: 'templates/article-list.tmpl.html',
        controller: 'MainController',
        resolve: {
            articles: function(leanDB, leanCache, $route, ITEMS_PER_PAGE){

                var page = $route.current.params['page'] || 0

                var cached = leanCache.fetch(page)

                if(cached){
                    return cached
                }else{
                    var cql = 'select title, tags, time from Article limit ' + page * ITEMS_PER_PAGE + ', ' + ITEMS_PER_PAGE

                    return leanDB.query(cql)
                }

            }
        }
    })

    .when('/articles/:id', {
        controller: 'ArticleDetailController',
        templateUrl: 'templates/article-detail.tmpl.html',
        resolve: {
            article: function(leanDB, $route){
                var aid = $route.current.params.id,
                    cql = 'select * from Article where objectId = "' + aid + '"'

                return leanDB.query(cql)

            }
        }
    })
   
    .when('/admin/', {
        templateUrl: 'templates/admin.tmpl.html',
        controller: 'AdminController'
    })

    .when('/login/', {
        templateUrl: 'templates/login.tmpl.html',
        controller: 'LoginController'
    })

    .when('/error/',{
        templateUrl:'templates/404.tmpl.html',
        controller: 'ErrorPageController'
    })

    .otherwise({
        redirectTo: '/error/'
    })

})

leanBlog.run(function($rootScope){

    $rootScope.items = [
        {name: '文章', pic:'article.png', link: '/'},
        {name: '生活', pic:'coffee.png', link: 'life'},
        {name: '简历', pic:'cv.png', link: 'cv'},
        {name: '摄影', pic:'pics.png', link: 'pics'},
        {name: '链接', pic:'link.png', link: 'link'},
        {name: '关于', pic:'about.png', link: 'about'},
        {name: '后台管理', pic:'back.png', link: 'admin'},
    ]

    $rootScope.socials = [
        {pic:'github.png', link: 'https://github.com/cynil'},
        {pic:'weibo.png', link: 'http://weibo.com/cynii'},
    ] 

    $rootScope.show = false

    $rootScope.hide = function(){
        $rootScope.show = false
    }

})

leanBlog.controller('MainController', function($scope, $rootScope, $location, leanCache, articles, ITEMS_PER_PAGE){
    
    $scope.articles = articles

    $scope.page = $location.search().page || 0

    //如果这次取出的数字小于一页的数字，说明下次就没有了
    if($scope.articles.length < ITEMS_PER_PAGE){
        $scope.nomore = true
    }

    if(!leanCache.fetch($scope.page)){
        leanCache.cache($scope.page, articles)
    }

    $scope.load = function(){
        $location.path('/').search('page', ++$scope.page)
    }
    
})

leanBlog.controller('ArticleDetailController', function($scope, $routeParams, article){

    $scope.aid = $routeParams.id

    $scope.article = article[0]
})

//记得改回来----------->
leanBlog.controller('CommentController', function($scope, leanDB, $route){
    $scope.comments = [
        {name: 'Leonis Doerwald', content: 'lorem ipsum dowagre consit lua, lorem ipsum dowagre consit lua, lorem ipsum dowagre consit lua', time: new Date('2013/4/5')},
        {name: 'Zhou Lianjian', content: 'dowagre consit lua shim bower coz infot', time: new Date('2013/4/5')},
        {name: 'Douglas', content: 'lamdys ino kotsot rinmothein gonjure saitus', time: new Date('2013/4/5')},
    ]
})
leanBlog.controller('CommentController', function($scope, leanDB, $route){

    var cql = 'select * from Comment where targetArticle = "' + $scope.$parent.aid + '" order by time'

    leanDB.query(cql).then(function(comments){

        $scope.comments = comments || []

    })

    $scope.newComment = {
        name: '',
        content: '',
        website: ''
    }

    $scope.addComment = function(){

        var aid = $scope.$parent.aid,
                    content = $scope.newComment.content,
                    time = new Date(),
                    name = $scope.newComment.name,
                    website = $scope.newComment.website

        //我从未见过有如此不堪入目之代码！！（+正义之凝视）
        var cql = 'insert into Comment(targetArticle,content,name,website,time)' + 
                  ' values("' + aid +'", "' + content +'", "' + name +'", "' + website +'", date("' + time.toJSON() +'"))'

        leanDB.query(cql).then(function(data){
            
            //insert仅仅返回id
            $scope.comments.unshift({
                id: data[0].id,
                content: content,
                time: time,
                name: name,
                website: website
            })

        }, function(err){

            console.log(err)

        })

    }

})

leanBlog.controller('ErrorPageController', function($scope, $location){
    $scope.gohome = function(){
        $location.path('/')
    }
})


leanBlog.controller('AdminController', function($scope, $location, leanDB){

    if(!leanDB.currentUser()){
        $location.path('/login')
    }else{
        console.log('well!')
    }

})

leanBlog.controller('LoginController', function($scope, $location, leanDB){
    $scope.user = {
        nick: '',
        password: ''
    }
    
    $scope.login = function(){
        
        leanDB.login($scope.user).then(function(admin){
            $location.path('/admin')
        },function(err){
            $scope.errMessage = err.message
        })
    }
})










