var oAs = document.querySelectorAll(".remove");
console.log(oAs);
for (var i = 0; i < oAs.length; i++) {
    oAs[i].onclick = fn
}

function fn() {
    var paths = (this.href).split('?');
    console.log(paths[1]);
    var xhr = new XMLHttpRequest();
    xhr.open("get", '/del?'+paths[1]);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(xhr.responseText){
                window.location.reload()
            }else{
                console.log('失败')
            }
        }
    };
    xhr.send();
    return false;
}




function queryURLParameter(url) {
    url = url || window.location.href;
    var obj = {}, reg = /([^?=&]+)=([^?=&]+)/g;
    url.replace(reg, function () {
        var arg = arguments;
        obj[arg[1]] = arg[2];
    });
    return obj;
}
//document.addEventListener("onclick",fn,false);
