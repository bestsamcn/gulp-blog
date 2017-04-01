@@include('dist/lib/jquery/dist/jquery.js')
@@include('dist/lib/bootstrap/dist/js/bootstrap.js')
@@include('dist/home/js/index.js')
require(['jquery', 'evt'], function($, E){
    var aLi = $('ul');
    aLi.each(function(index, item){
        $(item).on('click','li', function(){
            var $this = $(this);
            console.log($this.text())
        });
    });
    console.log($)
    var a = document.getElementById('container');
    E(a,'click', function(){
        console.log(this)
    })
});