//main打包
exports.main = {
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

//公共文件打包
exports.vendor = {
    optimize: 'uglify',
    uglify: {
        compress: {
            screw_ie8: false
        },
        mangle: {
            screw_ie8: false
        },
        output: {
            screw_ie8: false
        }
    },
    baseUrl:'./dist',
    paths:{
        vendor:'assets/js/vendor',
        template:'assets/libs/arttemplate',
        jquery:'assets/libs/jquery/dist/jquery.min',
        bootstrap:'assets/libs/bootstrap/dist/js/bootstrap.min',
        owlcarousel:'assets/libs/owl.carousel/dist/owl.carousel.min',
        q:'assets/libs/q/q'
    },
    shim:{
        q:{
            exports:'q'
        },
        jquery:{
            exports:'jquery'
        },
        template:{
            exports:'template'
        },
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
