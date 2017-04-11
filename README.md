# gulp-config
基于``gulp``, ``gulp-file-include``等插件的多页面传统模块化脚手架。

## 功能
### ``gulp dev``
1. 本地服务器。
2. 自动刷新。
3. ``css, js, html``文件引入编译。
4. 增量任务。
### ``gulp build``
1. 预览服务器
2. ``css, js, html`` 文件引入编译。
3. ``css, js``入口文件打包以及版本控制。
4. ``background-image``生成雪碧图以及版本控制。
5. 图片压缩。

## 任务
- 开发环境任务文件在``conf/gulp.dev.conf.js``，生产环境任务文件在``conf/gulp.prod.conf.js``。
- ``gulp dev``是开发环境下启动任务，没有做任何的压缩操作，方便调试。
- ``gulp build`` 这个任务会依据``main-*.{css,js}``进行打包，务必将页面入口css和js的前缀带有``main``，否则会出现异常情况。
- 生产环境打包后会删除一些不必要的目录和文件，并添加版本控制。

## 使用
- 目录结构形式务必要和``src``一样，``dist``文件夹会自动生成。
- 雪碧图需要用到的文件都应该放在``src/img/sprite``下面，方便打包。
- 由于服务器会自动将根目录的``index.html``作为入口，所以把首页的入口html文件放在根目录。
- ``src/assets``这个文件夹分为``css,img,js,libs``三个文件夹，``css,js``存放公共的文件，``img/sprite``中放雪碧图源文件，libs存放第三方js组件库。
- 其他文件夹以业务模块划分，例如首页是``home``,登录注册页是``sign``,其下都有两个文件夹``src/home/js``，``src/home/css``，以及页面（首页入口html放在根目录）
- ``src/include``这个文件夹主要放公共页面代码还有``meta``部分，后期可以将``art-template``模板存在此文件夹。
- 生产环境打包完成后，请将文件放在网站服务器的根目录下。

## 注意
- ``html,js,css``引入前缀都是``@@``，全部使用相对路径。
- html中的``css,js``文件的引入尽量使用绝对路径，因为生产环境打包添加版本控制的时候需要一个完整的路径。例如：
```html
<link rel="stylesheet" href="/home/css/main-home.css">
<script src="/js/require.js" data-main="/home/js/main-home.js"></script>
```
- 但是由于雪碧图生成修改路径的原因，css中的图片地址必须使用相对路径，另外由于合并了css，图片地址相对于目标文件。
```css
//base.css，引用img的图片应这么些写
.lala{
    width:34px;
    height:34px;
    background: url(../../img/sprite/cate-hot.png) 0 0 no-repeat;
}
```
- 这个模式没有使用requirejs，模块的声明和引入建议使用以下方式。
```javascript
//定义模块
var evt = (function(){
	var event = function(d, e, f){
        d.addEventListener(e, f, false);
    }
    return event;
})();
```
```javascript
//引用
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
})(jQuery, template, evt);
```
## 步骤
1. 请先安装浏览器livereload插件。  
2. 假设你已经全局安装了node,gulp,bower等cli, 那么可以执行以下命令：
```bash
git clone https://github.com/bestsamcn/gulp-config.git
cd gulp-config
npm install
bower install
gulp dev
gulp build
```

