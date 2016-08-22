var leanBlog = angular.module('leanBlog', ['ngRoute', 'leanDB', 'leanBlog.directives'])

leanBlog.constant('ITEMS_PER_PAGE', 6)

leanBlog.config(function($routeProvider){
    $routeProvider

    .when('/',{
        templateUrl: 'templates/article-list.tmpl.html',
        controller: 'MainController',
    })

    .when('/articles/:aid', {
        controller: 'ArticleDetailController',
        templateUrl: 'templates/article-detail.tmpl.html',
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

leanBlog.run(function($rootScope, leanDB){

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

    //控制sidebar
    $rootScope.show = false

    $rootScope.hide = function(){
        $rootScope.show = false
    }

    //navbar发表

    if(leanDB.currentUser()) $rootScope.logined = true
})

leanBlog.controller('MainController', function($scope, $rootScope, leanCache, leanDB, ITEMS_PER_PAGE){

    var cnt = 0
    var cached = leanCache.fetch('mainctrl') || {}
    
    $scope.articles = []

    if(!cached.articlePages){

        leanDB.query('select count(*) from Article').then(function(output){

            cached.articlePages = Math.ceil(output.count / ITEMS_PER_PAGE)

        }, function(err){
            console.log(err)
        })

    }

    $scope.load = function(){

        cnt = cnt + 1

        if(cnt > cached.articlePages){

            $scope.nomore = true

        }else{

            if(cached['page'+cnt]){

                $scope.articles = $scope.articles.concat(cached['page' + cnt])

            }else{
                $scope.loading = true

                var cql = 'select time,title,tags from Article limit ?, ? order by createdAt desc',
                    pvalues = [(cnt - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE]

                leanDB.query(cql, pvalues).then(function(articles){

                    $scope.articles = $scope.articles.concat(articles)

                    console.log(articles[0])

                    cached['page' + cnt] = articles

                    $scope.loading = false
                })
            }

        }
    } 

    $scope.load()

    $scope.$on('$destroy', function(){
        leanCache.cache('mainctrl', cached)
    })
})

leanBlog.controller('ArticleDetailController', function($scope, $routeParams, leanCache, leanDB){

    var cached = leanCache.fetch('articledetailctrl') || {}

    $scope.aid = $routeParams.aid

    if(cached['article' + $scope.aid]){

        $scope.article = cached['article' + $scope.aid]

    }else{

        var cql = 'select * from Article where objectId = "' + $scope.aid + '"'

        leanDB.query(cql).then(function(articles){

            $scope.article = articles[0]

            cached['article' + $scope.aid] = articles[0]

        })

    }

    $scope.$on('$destroy', function(){
        leanCache.cache('articledetailctrl', cached)
    })
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


leanBlog.controller('AdminController', function($scope, $location, leanDB, ITEMS_PER_PAGE){

    if(!leanDB.currentUser()){
        $location.path('/login')
    }

    var aCnt = 0
    var cCnt = 0

    $scope.articles = []; $scope.comments = []

    $scope.loadArticles = function(){

        $scope.loading = true

        var aCQL = 'select title,time from Article limit ?, ? order by createdAt desc',
            pvalues =  [aCnt * ITEMS_PER_PAGE, ITEMS_PER_PAGE]

        leanDB.query(aCQL, pvalues).then(function(articles){

            $scope.articles = $scope.articles.concat(articles)

            $scope.loading = false

        }, function(err){
            console.log(err)
        })

        aCnt++;

    }

    $scope.loadComments = function(){

        $scope.loading = true

        var cCQL = 'select targetArticle,content,name,time from Comment limit ?, ? order by createdAt desc',
            pvalues =  [cCnt * ITEMS_PER_PAGE, ITEMS_PER_PAGE]

        leanDB.query(cCQL, pvalues).then(function(comments){

            $scope.comments = $scope.comments.concat(comments)

            $scope.loading = false

        }, function(err){
            console.log(err)
        })

        cCnt++;
    }

    $scope.loadComments(); $scope.loadArticles();
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