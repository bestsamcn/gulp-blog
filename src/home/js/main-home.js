@@include('../../assets/libs/jquery/dist/jquery.js')
@@include('../../assets/libs/owl.carousel/dist/owl.carousel.js')
@@include('../../assets/libs/bootstrap/dist/js/bootstrap.js')
@@include('../../assets/js/arttemplate.js')
@@include('./index.js')
;(function($, template, E){
    var template = template || window.template;
    var $ = $ || window.jquery;
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
})(jQuery, template, evt)
    
