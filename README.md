# gulp-config
基于``gulp``, ``gulp-file-include``, ``gulp-requirejs-optimize``等的多页面脚手架。
这个分支是使用了rjs作为打包方式，打包配置文件在``conf/gulp.rjs.conf.js``中， 主要优势在于实现了公共模块与业务模块分离，最大限度优化性能。

## 功能
### ``npm run dev``开发环境任务
1.  本地服务器
2.  自动刷新
3.  ``css,html``文件编译
4. 增量任务
### ``npm run build``生产环境任务
1.  预览服务器
2.  ``css,html``模板编译
3.  ``css``打包压缩，版本控制
4.  ``js``模块打包压缩，版本控制，公共模块与业务模块分离
5.  ``background-image``生成雪碧图，修改雪碧图路径
6. 图片压缩

## 任务
- 开发环境任务文件在``conf/gulp.dev.conf.js``，生产环境任务文件在``conf/gulp.prod.conf.js``
- ``npm run dev``是开发环境下启动任务，没有做任何的压缩和打包操作，方便调试。
- ``npm run build`` 这个任务会依据所有``main-*.js``及其依赖进行打包，这个操作需要用到``conf/gulp.rjs.conf.js``配置需要用到的模块。如下:
```javascript
//业务模块打包
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

//公共模块打包
exports.vendor = {
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
```

## 使用
- 目录结构形式务必要和``src``一样，``dist``文件夹会根据环境任务执行自动生成相应环境的文件。
- 雪碧图需要用到的文件都应该放在``src/img/sprite``下面，方便打包，另外需要引用的图片，务必使用相对路径，因为打包的时候，插件不知道服务器根目录，写法如下：
```css
.home .hehe{
    width:34px;
    height:34px;
    background: url(../../assets/img/sprite/cate-other-on.png) 0 0 no-repeat;
}
```
- 由于服务器会自动将根目录的``index.html``作为入口，所以应把首页的入口html文件放在根目录。
- ``src/assets``这个文件夹分为``css,img,js,libs``三个文件夹，``css,js``存放公共的文件，``img/sprite``中放雪碧图源文件，``libs``存放第三方js组件库。
- 其他文件夹以业务模块划分，例如首页是``home``,登录注册页是``sign``,其下都有两个文件夹``src/home/js``，``src/home/css``，以及页面（首页入口html放在根目录）。
- ``src/include``这个文件夹主要放公共页面代码还有meta部分，后期可以将``art-template``模板存在此文件夹。
- 生产环境打包完成后，请将文件放在网站服务器的根目录下。

## 注意
- ``html,css``引入前缀都是``@@``，这种方式引入全是相对路径的。
- 各个业务模块中的模块入口``main-*.js``的``require.config``仅用于开发环境，生产环境的打包全部使用``conf/gulp.rjs.conf.js``的配置。
- ``html``中文件引入尽量使用绝对路径，因为生产环境打包添加版本控制的时候需要一个完整的路径，例如：
```html
<link rel="stylesheet" href="/home/css/main-home.css">
<script src="/assets/js/require.js" data-main="/home/js/main-home.js"></script>
```
- 但是因为雪碧图的原因，css的路径必须使用相对路径
```css
//base.css，引用img的图片应这么些写
.lala{
    width:34px;
    height:34px;
    background: url(../../img/sprite/cate-hot.png) 0 0 no-repeat;
}
- css注释必须使用/*xxxx*/，否则打包css会出问题
```

## 步骤
1.  安装浏览器livereload插件，safari下因为livereload的原因会报错。
2.  假设你已经全局安装了node,gulp,bower等cli，那么执行以下命令行：
```bash
git clone -b dev https://github.com/bestsamcn/gulp-config.git
cd gulp-config
npm install
bower install
npm run dev
npm run build
```

## 预览
- 该配置已开始实际应用。
- [请点击我](http://gulp.bestsamcn.me/)预览

