@@include('dist/lib/jquery/dist/jquery.js')
@@include('dist/lib/bootstrap/dist/js/bootstrap.js')
@@include('dist/js/arttemplate.js')
@@include('dist/home/js/index.js')
@@include('dist/lib/owl.carousel/dist/owl.carousel.js')
require(['jquery', 'evt', 'template'], function($, E, template){
    var template = template || window.template;
    $(function(){
        $.ajax({
            type:'get',
            dataType:'json',
            data:{
                modelBanner:3,
                seq:1,
                status:10
            },
            url:'http://media.3wyc.com/VideoProject/pipes/v1/banner/getListBanner',
            success:function(data){
                var bannerList = data.rows;
                console.log(bannerList)
                var bannerUrl = 'http://media.3wyc.com/VideoProject/files/banner/';
                var html = template('index-banner-tpl', { bannerList:bannerList, bannerUrl:bannerUrl });
                console.log(template)
                $('#index-banner-vm').html(html);
                $('#index-banner-vm').owlCarousel({
                    items:1
                });
            }
        })
        
    });
    var a = document.getElementById('container');
    E(a,'click', function(){
        console.log(this)
    })
});