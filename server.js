var express = require('express')

var server = express()
var directory = process.argv[2] || '/'
server.use(express.static(directory))
server.listen(3000, function(){
    console.log('server runing at: http://localhost:3000')
})

server.get('/favicon.ico', function(req, res){
    res.sendFile(__dirname + '/favicon.ico')
})