var http = require('http');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var listenPort = 80;//监听的端口

//创建写入文件
fs.exists("./write.txt", function (exists) {
    if (!exists) {
        fs.writeFile("./write.txt", "这是fs.writeFile创建并写入进来的", {encoding: 'utf-8', flag: 'a+'}, function (err) {
            console.log("write.txt创建成功")
        });
    } else {
        fs.writeFile("./write.txt", "----这是追加进来的", {encoding: 'utf-8', flag: 'a+'}, function (err) {
            console.log("write.txt追加内容成功")
        });
    }
});

//创建目录
makeP('mkf1/mkf2/mkf3');
function makeP(path) {
    var paths = path.split('/');
    for (var i = 1; i <= paths.length; i++) {
        var p = paths.slice(0, i).join('/');
        var exists = fs.existsSync(p);
        if (exists) {
            continue;
        } else {
            fs.mkdirSync(p);
            console.log(p + "目录创建成功")
        }
    }
}

//rmdirP('mkf1');
function rmdirP(path) {//递归太晕
    var paths = path.split('/');
    for (var i = paths.length; i >= 1; i--) {
        var p = paths.slice(0, i).join('/');
        if (fs.existsSync(path)) {
            if (fs.statSync(p).isDirectory()) {
                var fileList = fs.readdirSync(p);
                fileList.forEach(function (files) {
                    var curPatch = p + '/' + files;
                    if (fs.statSync(curPatch).isDirectory()) {
                        rmdirP(curPatch)
                    } else {
                        fs.unlinkSync(curPatch);
                    }
                });
                fs.rmdirSync(path);
            }
        }
    }
    return false;
}

http.createServer(function (req, res) {
    var url = req.url;
    var urls = url.split("?");
    var pathname = urls[0];
    var query = urls[1];
    var queryObj = {};
    res.setHeader("Server", "Node/V8");
    if (query) {//如果请求的URL不带参数，会变成undefined，导致报错，这里要判断一下
        var fields = query.split("&");
        fields.forEach(function (fields) {
            var vals = fields.split("=");
            queryObj[vals[0]] = vals[1];
        })
    }
    if (pathname == "/favicon.ico") {
        res.end();
    }
    //else if (pathname == "/") {
    //    res.writeHeader('Content-Type', "text/html; charset=utf-8");
    //    fs.readFile("index.html", function (err, data) {
    //        res.end(data);
    //    });
    //}
    else if (pathname == "/del") {
        for(var key in queryObj){
            console.log(queryObj[key]);
            rmdirP(queryObj[key]);
        }
        res.end();
    } else if (pathname == "/params") {
        //需要换成字符串才能返回给浏览器，要不是个对象，会报错的
        res.end(JSON.stringify(queryObj));
    } else {
        var reqFilename = "." + pathname;

        //fs.exists检查文件是否存在，会给回调函数传一个参数，true和false
        fs.exists(reqFilename, function (exists) {
            if (exists) {
                var str = '<link rel="stylesheet" href=/css/index.css/>';//不同路径下如何处理
                //var str='';

                if (fs.statSync(reqFilename).isDirectory()) {
                    //fs.readdir回调函数传递两个参数 err 和 files，files是一个包含 “ 指定目录下所有文件名称的” 数组。
                    fs.readdir(reqFilename, function (err, files) {
                        if (err) {
                            res.writeHeader(502, 'Content-Type', "text/html;charset=utf-8");
                            res.end("错误：" + err)
                        } else{
                            res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
                            files.forEach(function (file) {
                                if(file=="node_modules"||file=="css"||file=="js"||file==".git"||file==".idea"||file=="images"){

                                }else{
                                    var filePatch = reqFilename + '/' + file;
                                    if (pathname == "/") {
                                        if (fs.statSync(filePatch).isFile()) {
                                            str += '<p>';
                                            str += '<a href=/' + file + '>点击查看文件----' + file + '</a><a href=/del?path=' + file + ' class="remove">删除</a>';
                                        } else {
                                            str += '<p class="file">';
                                            str += '<a href=/' + file + '>点击查看文件夹----' + file + '</a><a href=/del?path=' + file + ' class="remove">删除</a>';
                                        }
                                        str += '</p>';
                                    } else {
                                        if (fs.statSync(filePatch).isFile()) {
                                            str += '<p>';
                                            str += '<a href=' + pathname + '/' + file + '>点击查看文件----' + file + '</a><a href=/del?path='+ reqFilename + '/' + file + ' class="remove">删除</a>';
                                        } else {
                                            str += '<p class="file">';
                                            str += '<a href=' + pathname + '/' + file + '>点击查看文件夹----' + file + '</a><a href=/del?path='+ reqFilename + '/' + file + ' class="remove">删除</a>';

                                        }
                                        str += '</p>';
                                    }
                                }
                            });
                            res.end(str)
                        }
                    });
                } else if (fs.statSync(reqFilename).isFile()) {
                    res.writeHeader(200, {'Content-Type': (mime.lookup(reqFilename)) + ";charset=utf-8"});
                    //readFile还是不要写"utf-8"的好，你也不知道要读的是什么文件
                    fs.readFile(reqFilename, function (err, data) {
                        res.end(data);
                    })
                }
            } else {
                //不加会乱码额，少那个都不行
                res.writeHeader(404, {'Content-Type': "text/html;charset=utf-8"});
                //console.log(mime.lookup(reqFilename));//这个玩意会根据请求的后缀判断
                res.end("拜托你要找的文件不存在--->404");
            }
        });
    }

}).listen(listenPort);
console.log("服务已启动，监听" + listenPort + "端口");
