define(function(){
    var event = function(d, e, f){
        d.addEventListener(e, f, false);
    }
    return event;
});