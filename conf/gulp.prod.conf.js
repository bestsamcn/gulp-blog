var PROD_HTTP = 'localhost'
var PROD_PORT = 8082;

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var livereload = require('gulp-livereload');
var runSequence = require('run-sequence');
var cssmin = require('gulp-cssmin');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var rjs = require('gulp-requirejs-optimize');
var spriter = require('gulp-css-spriter');
var fileinclude = require('gulp-file-include');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var debug = require('gulp-debug');
var pngquant = require('imagemin-pngquant');
var obfuscate = require('gulp-obfuscate');
var rjsConfig = require('./gulp.rjs.conf');

/**
 * 生产环境预览服务器
 */
gulp.task('server:build', function() {
    return connect.server({
        port: PROD_PORT,
        hostname: '0.0.0.0',
        root: './dist'
    });
});


/**
 * 打开浏览器
 */
gulp.task('open:build', function() {
    return gulp.src('').pipe(open({
        uri: 'http://' + PROD_HTTP + ':' + PROD_PORT
    }));
});



/**
 * 清理dist文件夹
 */
gulp.task('clean:build', function(){
    return gulp.src('dist')
    .pipe(clean())
});

/**
 * 赋值src到dist
 */
gulp.task('copy:build', ['clean:build'],function() {
    var src = 'src/**/*';
    var build = 'dist';
    return gulp.src(src)
    .pipe(gulp.dest(build));
});



/**
 * 引入文件编译
 */
gulp.task('includefile:build', function() {
    return gulp.src('src/**/*.{html,tpl}')
    .pipe(debug({title:'复制:'}))
    .pipe(fileinclude({
        prefix:'@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest('dist'))
});


/**
 * 删除压缩过的js
 */
gulp.task('deljs:build', function(){
    return gulp.src(['dist/**/*-*-*.js','!dist/assets/libs/**/*.js'])
    .pipe(vinylPaths(del))
})

/**
 * 打包所有入口js模块，,生产版本，并添加路径到manifest中
 */
gulp.task('rjs:build', ['deljs:build'], function(){
    return gulp.src(['dist/**/main-*.js', '!dist/assets/libs/**/*.js'])
    .pipe(rjs(rjsConfig.main))
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/js'));
});

/**
 * 根据manifest修改模板html中的js路径
 */
gulp.task('jsdir:build',['rjs:build'], function(){
    return gulp.src(['dist/rev/js/*.json', 'dist/**/*.html', '!dist/assets/libs/**/*'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist'))
});

/**
 * 单独打包vendor公共模块
 */
gulp.task('rjs:vendor:build', function(){
    return gulp.src('dist/assets/js/vendor.js')
    .pipe(rjs(rjsConfig.vendor))
    //需要指定文件夹，如果只是dist，那么会分配到根目录
    .pipe(gulp.dest('dist/assets/js'))
});

/**
 * 雪碧图build，拷贝图片-压缩css-雪碧图
 */
gulp.task('spriter:build', function(){
    var timestamp = +new Date();
    return gulp.src(['dist/**/*.css','!dist/libs/**/*.css'])
    .pipe(spriter({
        spriteSheet: 'dist/assets/img/sprite_icon_' + timestamp + '.png',
        pathToSpriteSheetFromCSS: '/assets/img/sprite_icon_' + timestamp + '.png',
        spritesmithOptions: {
            padding: 10
        }
    }))
    .pipe(gulp.dest('dist'))
});


/**
 * 删除压缩过的css
 */
gulp.task('delcss:build', function(){
    return gulp.src(['dist/**/*-*-*.css','!dist/assets/lib/**/*.css'])
    .pipe(vinylPaths(del))
})

/**
 * 压缩css,添加版本控制，并将路径写入manifest
 */
gulp.task('cssmin:build', function(){
    return gulp.src(['dist/**/*.css', '!dist/assets/libs/**/*.css'])
    .pipe(cssmin())
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/css'));
});

/**
 * 根据manifest修改模板html中的css路径
 */
gulp.task('cssdir:build', ['cssmin:build'], function(){
    return gulp.src(['dist/rev/css/*.json', 'dist/**/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist'))
});

/**
 * 压缩图片
 */
gulp.task('imagemin:build', function(){
    return gulp.src('dist/assets/img/*.{jpg,jpeg,ico,png,xpng,gif}')
    .pipe(imagemin({
        optimizationLevel:5,
        progressive:true,
        interlaced:true,
        multipass:true,
        use: [pngquant()]
    }))
    .pipe(debug({title:'图片压缩:'}))
    .pipe(gulp.dest('dist/assets/img'))
});

/**
 * 利用fileinclude实现css模块化
 */
gulp.task('includecs:build', function() {
    return gulp.src(['src/**/*.css'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('dist'))
});

/**
 * 压缩html
 */
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        // collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        // removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(['dist/**/*.html', '!dist/libs', '!dist/include'])
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
});


/**
 * 删除所有非main开头的css和js
 */
gulp.task('delrubbish', function(){
    //删除文件夹可以使用dist/folder
    return gulp.src(['dist/{rev,include}', 'dist/assets/img/sprite', 'dist/assets/css/**/*.css', 'dist/**/js/*.js',
        'dist/assets/js/*.js', 'dist/**/css/*.css', '!dist/assets/css/**/*-*.css', '!dist/assets/libs/**/*.css', '!dist/assets/js/vendor.js', '!dist/**/main-*-*.js', '!dist/assets/libs/**/*','!dist/**/main-*-*.css'])
    .pipe(vinylPaths(del))
});

/**
 * 压缩require.js
 */
gulp.task('libsmin', function () {
    return gulp.src('dist/assets/libs/*.js')
    .pipe(debug({title:'复制:'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/libs'));
});

/**
 * 混淆代码///有问题。。
 */
gulp.task('obfuscate', function(){
    return gulp.src('dist/**/*/main-*-*.js')
    .pipe(debug({title:'混淆:'}))
    .pipe(obfuscate())
    .pipe(gulp.dest('dist'))
});

