@@include('dist/lib/jquery/dist/jquery.js')
@@include('dist/lib/bootstrap/dist/js/bootstrap.js')
@@include('dist/home/js/index.js')
@@include('dist/lib/owl.carousel/dist/owl.carousel.js')
require(['jquery', 'evt'], function($, E){
    var aLi = $('ul');
    aLi.each(function(index, item){
        $(item).on('click','li', function(){
            var $this = $(this);
            console.log($this.text())
        });
    });
    $(function(){
        $('#index-banner-vm').owlCarousel({
            items:1
        });
    });
    var a = document.getElementById('container');
    E(a,'click', function(){
        console.log(this)
    })
});