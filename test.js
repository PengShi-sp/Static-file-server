function oo(){
    return 1;
}
var oo;
console.log(typeof oo);

//if(!("sohu" in window)){
//    var sohu=1;
//}
//console.log(sohu);

var qq={
    alias:"TTT",
    test:function(){
        console.log(this.alias);
    }
};
setTimeout(qq.test,500);