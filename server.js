var http=require('http');
var fs=require('fs');

http.createServer(function(req,res){
    var url=req.url;

    res.end('hello');
    console.log(url);

}).listen(8080);
console.log("服务已启动，监听8080");
