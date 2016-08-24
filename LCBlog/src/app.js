var leanBlog = angular.module('leanBlog', ['ngRoute', 'leanDB', 'leanBlog.directives', 'ngSanitize'])

leanBlog.constant('ITEMS_PER_PAGE', 6)

leanBlog.config(function($routeProvider){
    $routeProvider

    .when('/',{
        templateUrl: 'templates/article-list.tmpl.html',
        controller: 'MainController',
    })

    .when('/tag/:tag',{
        templateUrl: 'templates/article-list.tmpl.html',
        controller: 'TagController',
    })

    .when('/articles/:aid', {
        controller: 'ArticleDetailController',
        templateUrl: 'templates/article-detail.tmpl.html',
    })

    .when('/newpost/', {
        templateUrl:'templates/newpost.tmpl.html',
        controller: 'NewpostController'
    })

    .when('/edit/:aid', {
        templateUrl:'templates/newpost.tmpl.html',
        controller: 'EditpostController'
    })   

    .when('/admin/', {
        templateUrl: 'templates/admin.tmpl.html',
        controller: 'AdminController'
    })

    .when('/about/', {
        templateUrl: 'templates/about.tmpl.html'
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

leanBlog.controller('MainController', function($scope, $rootScope, $location, leanDB, ITEMS_PER_PAGE){

    $scope.totalPages = 0
        
    $scope.currentPage = $location.search()['page'] || 1
    
    $scope.articles = []

    leanDB.query('select count(*) from Article').then(function(output){

        $scope.totalPages = Math.ceil(output.count / ITEMS_PER_PAGE)

        $scope.load()

    }, function(err){
        $rootScope.showError = true
        $rootScope.errorMessage = err.message
    })

    $scope.load = function(){

        if($scope.currentPage > $scope.totalPages){

            $scope.nomore = true

        }else{
            $scope.loading = true

            var cql = 'select time,title,tags from Article limit ?, ? order by createdAt desc',
                pvalues = [($scope.currentPage - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE]

            leanDB.query(cql, pvalues).then(function(articles){

                $scope.articles = articles

                $scope.loading = false
            })
        }
    }

    $scope.next = function(){

        $location.path('/').search('page', parseInt($scope.currentPage) + 1)
    }
})

leanBlog.controller('TagController', function($scope, $rootScope, $location, $routeParams, leanDB, ITEMS_PER_PAGE){

    $scope.totalPages = 0

    $scope.currentPage = $location.search()['page'] || 1
    
    $scope.currentTag = $routeParams['tag']
    
    $scope.articles = []

    leanDB.query('select count(*) from Article where tags = "' + $scope.currentTag + '"').then(function(output){

        $scope.totalPages = Math.ceil(output.count / ITEMS_PER_PAGE)

        $scope.load()

    }, function(err){

        $rootScope.errorMessage = err.message

        $rootScope.showError = true

    })

    $scope.load = function(){

        if($scope.currentPage > $scope.totalPages){

            $scope.nomore = true

        }else{
            $scope.loading = true

            var cql = 'select time,title,tags from Article where tags = ? limit ?, ? order by createdAt desc',
                pvalues = [$scope.currentTag + '', ($scope.currentPage - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE]

            leanDB.query(cql, pvalues).then(function(articles){

                $scope.articles = articles

                $scope.loading = false
            })
        }
    }

    $scope.next = function(){
        $location.path('/tag/' + $scope.currentTag).search('page', parseInt($scope.currentPage) + 1)
    } 
})

leanBlog.controller('ArticleDetailController', function($scope, $routeParams, leanDB){

    $scope.marked = marked

    $scope.aid = $routeParams.aid

    var cql = 'select * from Article where objectId = "' + $scope.aid + '"'

    leanDB.query(cql).then(function(articles){

        $scope.article = articles[0]

        $scope.article.content = marked($scope.article.content)

    })
})

leanBlog.controller('CommentController', function($scope, $rootScope, leanDB, $route){

    var cql = 'select * from Comment where targetArticle = "' + $scope.$parent.aid + '" order by createdAt desc'

    leanDB.query(cql).then(function(comments){

        $scope.comments = comments || []

    })

    $scope.newComment = {}

    $scope.addComment = function(){

        if(leanDB.currentUser()){
            $scope.isAdmin = true
        }

        var aid = $scope.$parent.aid,
                    content = $scope.newComment.content,
                    time = new Date(),
                    name = $scope.isAdmin ? 'cYnii' : $scope.newComment.name || '匿名者',
                    website = $scope.newComment.website || 'http://cynil.github.io'

        var cql = 'insert into Comment(targetArticle,content,name,website,time) values(?, ?, ?, ?, date(?))'

        var pvalues = [aid, content, name, website, time]

        leanDB.query(cql, pvalues).then(function(data){
            
            //insert仅仅返回id
            $scope.comments.unshift({
                id: data[0].id,
                content: content,
                time: time,
                name: name,
                website: website
            })

        }, function(err){

            $rootScope.errorMessage = err.message
            $rootScope.showError = true

        })

    }

})

leanBlog.controller('ErrorPageController', function($scope, $location){
    $scope.gohome = function(){
        $location.path('/')
    }
})

leanBlog.controller('NewpostController', function($scope, $location, leanDB){

    $scope.post = function(){

        $scope.tags = !$scope.tags ? [] : $scope.tags.split(',').map(function(v){
            return v.trim()
        }).filter(function(v){
            return v != ''
        })

        var cql = 'insert into Article(title, tags, content, time) values(?,?,?,date(?))'
            pvalues = [$scope.title, $scope.tags, $scope.content, new Date().toJSON()]
            
        leanDB.query(cql, pvalues).then(function(newposts){
            var aid = newposts[0].id

            $location.path('/articles/' + aid)
        })
    }
})

leanBlog.controller('EditpostController', function($scope, $rootScope,$routeParams, $location, leanDB){

    $scope.aid = $routeParams.aid

    leanDB.query('select * from Article where objectId = "' + $scope.aid + '"').then(function(output){
        $scope.title = output[0].title
        $scope.tags = output[0].tags.join(',')
        $scope.content = output[0].content
    })

    $scope.post = function(){

        $scope.tags = $scope.tags.split(',').map(function(v){
            return v.trim()
        }).filter(function(v){
            return v != ''
        })

        var cql = 'update Article set title = ?, tags = ?, content = ?, time = date(?) where objectId = ?'
            pvalues = [$scope.title, $scope.tags, $scope.content, new Date().toJSON(), $scope.aid]
            
        leanDB.query(cql, pvalues).then(function(updatedposts){

            $location.path('/articles/' + $scope.aid)

        }, function(err){
            $rootScope.errorMessage = err.message
            $rootScope.showError = true
        })
    }
})

leanBlog.controller('AdminController', function($scope, $rootScope, $location, $timeout, leanDB, ITEMS_PER_PAGE){

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

            $rootScope.errorMessage = err.message
            $rootScope.showError = true

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

    $scope.delete = function(isArticle, id){
        var cql

        if(isArticle){

            $scope.articles.splice(findKey($scope.articles, id), 1)
            cql = 'delete from Article where objectId = ?'

        }else {

            $scope.comments.splice(findKey($scope.comments, id), 1)
            cql = 'delete from Comment where objectId = ?'

        }

        var pvalues = [id]

        leanDB.query(cql, pvalues).then(function(output){

            $rootScope.errorMessage = '删除成功！'
            $rootScope.showError = true

        }, function(err){

             $rootScope.showError = true
             $rootScope.errorMessage = '删除失败了:(  ' + err.message

        })

        function findKey(arr, value){
            for(var i = 0; i < arr.length; i++){
                if(arr[i].id = value){
                    return i
                }
            }
        }
    }

    $scope.loadComments(); $scope.loadArticles()
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