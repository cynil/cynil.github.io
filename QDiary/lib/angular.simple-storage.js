angular.module('simpleStorage', [])
    .factory('$myStorage', function () {
        return {
            open: function(dbname){

                return {
                    namespace: dbname,
                    
                    query: function(){
                            return this.search('*')
                    },
                    
                    search: function(keyword){
                        
                        var result = []
                        
                        for(var guid in localStorage){
                            if(guid.indexOf(this.namespace) > -1 && localStorage[guid].indexOf(keyword === '*' ? '' : keyword) > -1){
                                result.push(JSON.parse(localStorage[guid]))
                            }
                        }
                        
                        return result
                    },
                    
                    create: function(o){
                        var guid = this.namespace + new Date().getTime()
                        o.guid = guid
                        localStorage[guid] = JSON.stringify(o)

                        return guid
                    },
                    
                    read: function(guid){
                        return JSON.parse(localStorage[guid])
                    },
                    
                    update: function(o){
                        localStorage[o.guid] = JSON.stringify(o)
                    },

                    'delete': function (o){
                        delete localStorage[o.guid]
                    }
                }
            },
            simple: function(key, value){
                if(value === undefined){
                    return localStorage[key]
                }else if(key === ''){
                    delete localStorage[key]
                }else{
                    localStorage[key] = value
                }
            }
        }
    })










