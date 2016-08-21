var leanBlog = angular.module('leanBlog', ['ngRoute', 'leanDB', 'leanBlog.directives'])

leanBlog.config(function($routeProvider){
    $routeProvider

    .when('/',{
        templateUrl: 'templates/article-list.tmpl.html',
        controller: 'MainController',
        resolve: {
            articles: function(leanDB){

                //return leanDB.query('select title,time from Article')

                return [
                    {
                        id: '00001',
                        tags: ['CSS', '设计', '其他'],
                        title: 'sass语法速记',
                        time: new Date('2011/3/21')
                    },
                    {
                        id: '00002',
                        tags: ['javascript', '基础理论'],
                        title: '深入作用域与闭包',
                        time: new Date('2011/5/1')
                    },                    
                    {
                        id: '00003',
                        title: '简单理解jsonp',
                        time: new Date('2011/2/13')
                    },
                    {
                        id: '00004',
                        tags: ['CSS', 'javascript', '动画'],
                        title: 'setTimeout(fn(){},0)的妙用',
                        time: new Date('2011/5/9')
                    }
                ]

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

                //return leanDB.query(cql)

                return [{
                        id: '00004',
                        title: 'setTimeout(fn(){},0)的妙用',
                        tags: ['CSS', 'javascript', '动画'],
                        time: new Date('2011/5/9'),
                        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur beatae nesciunt voluptates, voluptas cumque reiciendis quidem cum, eligendi officiis eos, a ratione sint, nemo accusantium omnis aperiam corporis. Repellendus, ad nulla odio sapiente maiores perferendis aspernatur aperiam nobis voluptates quasi adipisci id eius omnis quae in officiis dolore explicabo perspiciatis nesciunt delectus alias, qui? Ea veritatis deserunt, excepturi atque, modi, eaque impedit perspiciatis saepe eum voluptas minus maiores dignissimos.'
                    }]
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

leanBlog.controller('MainController', function($scope, $rootScope, articles){
    $scope.articles = articles

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
leanBlog.controller('commentController', function($scope, leanDB, $route){

    var cql = 'select * from Comment where targetArticle = "' + $scope.$parent.aid + '"'

    leanDB.query(cql).then(function(comments){

        $scope.comments = comments.sort(function(a, b){
            return b.time - a.time
        })

    })

    $scope.newComment = {content: ''}

    $scope.addComment = function(){

        var aid = $scope.$parent.aid,
            content = $scope.newComment.content,
            date = new Date()

        //我从未见过有如此不堪入目之代码！！（+正义之凝视）
        var cql = 'insert into Comment(targetArticle,content,time)' + 
                  ' values("' + aid +'", "' + content +'", date("' + date.toJSON() +'"))'

        leanDB.query(cql).then(function(data){
            
            //insert仅仅返回id
            $scope.comments.unshift({
                id: data[0].id,
                content: content,
                time: date
            })

            $scope.newComment.content = ''

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










