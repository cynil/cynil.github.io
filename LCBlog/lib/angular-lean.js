angular.module('leanDB', [])
    .constant('LEAN_DB',{
        'APP_ID': 'oE6nrXfeSIBdGPxMm0XINHB9-gzGzoHsz',
        'APP_KEY': 'dFvoexXSk6iePA6CnPRsUSBr',
    })

    .factory('leanDB', function($q, $rootScope, LEAN_DB){

        AV.init({
            appId: LEAN_DB.APP_ID,
            appKey: LEAN_DB.APP_KEY
        })

        //一律采用CQL
        return {

            query: function(cql, pvalues){

                var deferred = $q.defer()

                AV.Query.doCloudQuery(cql, pvalues).then(function(data){
                    
                    var results = data.results,
                        output = []

                    if(data.count){
                        output.count = data.count
                    }

                    results.forEach(function(result){

                        var mixin = {}

                        mixin['id'] = result.id
                        
                        for(var i in result._serverData){
                            mixin[i] = result.get(i)
                        }

                        output.push(mixin)
                    })

                    deferred.resolve(output)

                }, function(err){

                    deferred.reject(err)

                })

                return deferred.promise
            },

            currentUser: function(){
                return AV.User.current()
            },

            login: function(obj){
                var deferred = $q.defer()

                AV.User.logIn(obj.nick, obj.password).then(function(loginedUser){

                    $rootScope.logined = true

                    deferred.resolve(loginedUser)

                }, function(err){

                    deferred.reject(err)
                    
                    console.log(err)
                })

                return deferred.promise
            }
        }
    })

    .factory('leanCache', function(){

        var cache = {}

        return {
            cache: function(key, data){
                
                cache[key] = data
            },

            fetch: function(key){
                if(cache[key]){
                    return cache[key]
                }else{
                    return false
                }
            }
        }
    })