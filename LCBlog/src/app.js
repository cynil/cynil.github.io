var wdblog = angular.module('wdblog', ['ngRoute', 'wilddog'])

wdblog.config(function($routeProvider){
    $routeProvider.when('/', {
        templateUrl: 'welcome.tmpl.html',
        controller: 'WelcomeController'
    })
    .when('/articles', {
        templateUrl: 'article-list.tmpl.html',
        controller: 'ListController'
    })
    .when('/articles/:aid', {
        templateUrl: 'article.tmpl.html',
        controller: 'ArticleController'
    })
})

wdblog.controller('ListController', function($scope, $wilddogArray){

    var ref = new Wilddog('https://cyni-blog.wilddogio.com/articles')
    $scope.articles = $wilddogArray(ref);
})










function m(){

    var cyniArticlesRef = new Wilddog("https://cyni-blog.wilddogio.com/articles")

    $('#add-article').on('submit', function(event){
        var $title = $('#article-title'),
            $content = $('#article-content'),
            $category = $('#article-category')

        event.preventDefault()

        if(!$title.val() || !$content.val()){
            return
        }else{
            var newPostRef = cyniArticlesRef.push({
                title: $title.val(),
                date: Date.now(),
                category: $category.val(),
                body: $content.val(),
                comments: ''
            }, function(err){
                if(err){
                    $('#status').text(err.toString())
                }else{
                    $('#status').text('success!')
                }
            })
        }
    })

    $('#login').on('submit', function(event){

        var cyniLoginRef = new Wilddog("https://cyni-blog.wilddogio.com/")
        
        event.preventDefault()

        cyniLoginRef.authWithOAuthPopup('qq', function(err, auth){
            if(err){
                console.log(err)
            }else{
                console.log(auth)
                var html = '<a href="' + auth.qq.cachedUserProfile.figureurl_qq_1 + '"><img src="' + auth.qq.cachedUserProfile.figureurl_qq_1 + '" /></a>' + '<span class="qq-nickname">' + auth.qq.cachedUserProfile.nickname + '</span>'
                //console.log(auth.uid, auth.qq.cachedUserProfile.figureurl_qq_1,auth.qq.cachedUserProfile.nickname)
                $('#profile').html(html)
            }
        })
    })

    $('#load-blog').on('submit', function(event){

        var url = 'https://cyni-blog.wilddogio.com/' + ($('#collection').val() || 'articles')

        var ref = new Wilddog(url)

        event.preventDefault()

        $('#data-panel').text('')

        ref.on('value', function(snapshot){

            //snapshot.forEach(function(snap){

                $('#data-panel').append('<p>' + JSON.stringify(snapshot.val()) + '</p>')

            //})

        })

        // ref.once('child_added', function(snapshot){

        //     // snapshot.forEach(function(child){
                
        //     //     $('#data-panel').append('<p>' + child.val() + '</p>')

        //     // })

        //     $('#data-panel').append('<p>' + JSON.stringify(snapshot.val()) + '</p>')

        // })
    })
    

}