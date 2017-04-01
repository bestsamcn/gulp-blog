# gulp-config
基于gulp, gulp-file-include, requirejs的多页面脚手架

## 使用
- 目录结构形式主要以业务模块来区分
- js和css使用file-include插件实现合并
- 每个页面除了requirejs都只有一个js入口文件，类似的还有css
- js模块声明必须使用defined(moduleName, [], function(){})的方式，方便main通过模块名来引入


## 注意
- 因为使用fileinclude来合并了css和js，所以里面的路径都是以合并后的文件为准，例如：dist/css/base.css这个文件
在home/css/index.css中引入了,其中的css路径是针对home/css/index.css的
```css
//base.css，引用img的图片应这么些写
.lala{
    width:34px;
    height:34px;
    background: url(../../img/sprite/cate-hot.png) 0 0 no-repeat;
}
```
- 目录结构务必和src相同

## 命令
```
gulp
gulp build
```

