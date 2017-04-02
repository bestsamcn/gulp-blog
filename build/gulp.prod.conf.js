var DEV_HTTP = 'localhost'
var PROD_PORT = 8082;

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var livereload = require('gulp-livereload');
var template = require('gulp-art-include');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var optimize = require('gulp-requirejs-optimize');
var spriter = require('gulp-css-spriter');
var amdOptimize = require('amd-optimize');
var concat = require('gulp-concat');
var fileinclude = require('gulp-file-include');
var clean = require('gulp-clean');

/**
 * build server
 */
gulp.task('server:build', function() {
    connect.server({
        livereload: {
            port:35731
        },
        port: PROD_PORT,
        hostname: '0.0.0.0',
        root: './dist'
    });
});


gulp.task('open:build', function() {
    gulp.src('').pipe(open({
        uri: 'http://' + DEV_HTTP + ':' + PROD_PORT
    }));
});



/**
 * build复制全部
 */
gulp.task('clean:build', function(){
    return gulp.src('dist')
    .pipe(clean())
})
gulp.task('copy:build', ['clean:build'],function() {
    var src = 'src/**/*';
    var build = 'dist';
    return gulp.src(src)
    .pipe(gulp.dest(build));
});





/**
 * build编译模板
 */
gulp.task('template:build', function() {
    return gulp.src('dist/**/*.html')
    .pipe(template())
    .pipe(gulp.dest('dist'))
});


//压缩，重命名，修改模板路径=============================================================================================================
/**
 * 删除压缩过的js
 */
gulp.task('delminjs:build', function(){
    return gulp.src(['dist/**/*-*-*.js','!dist/lib/**/**.js'])
    .pipe(vinylPaths(del))
})

/**
 * 压缩混淆js,如果使用suffix的话，js不能替换src
 */
gulp.task('uglify:build', ['delminjs:build'], function(){
    return gulp.src(['dist/**/*.js', '!dist/lib/**/*.js'])
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/js'));
});

/**
 * 根据manifest修改模板js路径
 */
gulp.task('jsmin:build', ['uglify:build'], function(){
    gulp.src(['dist/rev/js/*.json', 'dist/**/*.html', '!dist/lib/**/*'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist'))
});


//压缩，重名，如果使用suffix的话, 修改路径======================================================================
/**
 * 删除压缩过的js
 */
gulp.task('delmincss:build', function(){
    return gulp.src(['dist/**/*-*-*.css','!dist/lib/**/*.css'])
    .pipe(vinylPaths(del))
})

/**
 * 压缩混淆js,如果使用suffix的话，js不能替换src
 */
gulp.task('cssminify:build', ['delmincss:build'], function(){
    return gulp.src(['dist/**/*.css', '!dist/lib/**/*.css'])
    .pipe(cssmin())
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/css'));
});

/**
 * 根据manifest修改模板js路径
 */
gulp.task('cssmin:build', ['cssminify:build'], function(){
    gulp.src(['dist/rev/css/*.json', 'dist/**/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist'))
});



/**
 * 雪碧图build，拷贝图片-压缩css-雪碧图
 */
gulp.task('spriter:build', function(){
    var timestamp = +new Date();
    return gulp.src('dist/**/*.css')
    .pipe(spriter({
        spriteSheet: 'dist/img/sprite/sprite_icon_' + timestamp + '.png',
        pathToSpriteSheetFromCSS: '/img/sprite/sprite_icon_' + timestamp + '.png',
        spritesmithOptions: {
            padding: 10
        }
    }))
    .pipe(gulp.dest('dist'))
});


/**
 * 压缩图片
 */
gulp.task('imagemin:build', function(){
    gulp.src('dist/img/*.{jpg,jpeg,ico,png,xpng,gif}')
    .pipe(cache(imagemin({
        optimizationLevel:5,
        progressive:true,
        interlaced:true,
        multipass:true
    })))
    .pipe(gulp.dest('dist/img'))
});


/**
 * 利用fileinclude实现js模块化
 */
gulp.task('includejs:build', function() {
    return gulp.src('dist/**/*.js')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root'
    }))
    .pipe(gulp.dest('dist'));
});


/**
 * 利用fileinclude实现css模块化
 */
gulp.task('includecs:build', function() {
    return gulp.src('dist/**/*.css')
    .pipe(fileinclude({
      prefix: '@@@',
      basepath: '@root'
    }))
    .pipe(gulp.dest('dist'));
});

/**
 * 删除所有非main开头的css和js
 */

gulp.task('delrubbish', function(){
    //删除文件夹可以使用dist/folder
    return gulp.src(['dist/**/*.{js,css}','dist/{css,include,rev,lib}', '!dist/**/{main-*,require}-*.{js,css}'])
    .pipe(vinylPaths(del))
})

