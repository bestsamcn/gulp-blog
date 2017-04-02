# gulp-config
基于gulp, gulp-file-include, requirejs的多页面脚手架。

## 任务
- 默认的任务``gulp``是开发环境下启动任务，没有做任何的压缩操作，方便调试。
- 生产环境打包使用``gulp build`` 这个任务会依据``main-*.{css,js}``进行打包，务必将页面入口css和js的前缀带有``main``，否则会出现异常情况。
- 生产环境打包后会删除一些不必要的目录和文件，并添加版本控制。

## 使用
- 目录结构形式务必要和``src``一样，``dist``文件夹会自动生成。
- 由于服务器会自动将根目录的``index.html``作为入口，所以把首页的入口html文件放在根目录。
- ``src/lib``放js库，例如``require.js``,``common.js``,``src/css``放第三方的css文件还有公共css（``base.css``），例如``animate.css``，``src/img``放全部的图片文件，其下子文件夹``src/img/sprite``放雪碧图的源文件。
- 其他文件夹以业务模块划分，例如首页是``home``,登录注册页是``sign``,其下都有两个文件夹``src/home/js``，``src/home/css``，以及页面（首页入口html放在根目录）。
- ``src/include``这个文件夹主要放公共页面代码还有meta部分。

## 注意
- 文件的引入尽量使用绝对路径，因为生产环境打包添加版本控制的时候需要一个完整的路径。
```html
<link rel="stylesheet" href="/home/css/main-home.css">
<script src="/js/require.js" data-main="/home/js/main-home.js"></script>
```
- 因为使用fileinclude来合并了css和js，所以里面的路径都是以合并后的文件为准，例如：``dist/css/base.css``这个文件
在``home/css/index.css中``引入了,其中的css路径是针对``home/css/index.css``的。
```css
//base.css，引用img的图片应这么些写
.lala{
    width:34px;
    height:34px;
    background: url(../../img/sprite/cate-hot.png) 0 0 no-repeat;
}
```
- 模块的声明必须使用以下方式，因为``@@include``合并文件后，需要通过模块名来查找模块。
```javascript
define('ModuleName',['Dependencies'],function(){ //your code})
```
## 步骤
请先安装浏览器livereload插件。
假设你已经全局安装了node,gulp,bower等cli，safari下因为livereload的原因会报错。
```bash
git clone https://github.com/bestsamcn/gulp-config.git
cd gulp-config
npm install
bower install
gulp 
gulp build
```

