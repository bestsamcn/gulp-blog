module.exports = {
	baseUrl:'./dist',
    paths:{
        // vendor:'assets/js/vendor',
        vendor:'empty:',
        template:'assets/libs/arttemplate',
        CONFIG:'assets/js/config',
        API:'assets/js/service',
        jquery:'assets/libs/jquery/dist/jquery.min',
        bootstrap:'assets/libs/bootstrap/dist/js/bootstrap.min',
        owlcarousel:'assets/libs/owl.carousel/dist/owl.carousel.min',
        q:'assets/libs/q/q',
        evt:'home/js/index',
        plus:'sign/js/index'
    },
    shim:{
    	bootstrap:{
    		deps:['jquery'],
            exports:'bootstrap'
    	},
    	owlcarousel:{
    		deps:['jquery'],
            exports:'owlcarousel'
    	}
    }
}
