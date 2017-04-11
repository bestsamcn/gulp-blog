var DEV_HTTP = 'localhost'
var PROD_PORT = 8082;

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var livereload = require('gulp-livereload');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var imagemin = require('gulp-imagemin');
var spriter = require('gulp-css-spriter');
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

/**
 * 复制全部
 */
gulp.task('copy:build', ['clean:build'], function() {
    return gulp.src('src/**/*')
    .pipe(gulp.dest('dist'));
});

/**
 * build编译模板
 */
gulp.task('includehtml:build', function() {
    return gulp.src('dist/**/*.html')
    .pipe(fileinclude({
        prefix:'@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest('dist'))
});

/**
 * 利用fileinclude实现js模块化
 */
gulp.task('includejs:build', function() {
    return gulp.src(['dist/**/*.js', '!dist/assets/**/*'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('dist'));
});

/**
 * 压缩js
 */
gulp.task('jsmin:build', ['includejs:build'], function(){
    return gulp.src(['dist/**/*.js', '!dist/assets/libs/**/*.js'])
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/js'));
});

/**
 * 根据manifest修改模板js路径
 */
gulp.task('jsdir:build', ['jsmin:build'], function(){
    gulp.src(['dist/rev/js/*.json', 'dist/**/*.html', '!dist/assets/**/*'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist'))
});

/**
 * 利用fileinclude实现css模块化
 */
gulp.task('includecs:build', function() {
    return gulp.src(['dist/**/*.css', '!dist/assets/**/*'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('dist'));
});

/**
 * 压缩css
 */
gulp.task('cssmin:build', ['includecs:build'], function(){
    return gulp.src(['dist/**/*.css', '!dist/assets/libs/**/*'])
    .pipe(cssmin())
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/css'));
});

/**
 * 根据manifest修改模板js路径
 */
gulp.task('cssdir:build', ['cssmin:build'], function(){
    gulp.src(['dist/rev/css/*.json', 'dist/**/*.html', '!dist/assets/**/*'])
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
        spriteSheet: 'dist/assets/img/sprite_icon_' + timestamp + '.png',
        pathToSpriteSheetFromCSS: '/assets/img/sprite_icon_' + timestamp + '.png',
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
    .pipe(imagemin({
        optimizationLevel:5,
        progressive:true,
        interlaced:true,
        multipass:true
    }))
    .pipe(gulp.dest('dist/img'))
});

/**
 * 删除所有非main开头的css和js
 */
gulp.task('delrubbish', function(){
    //删除文件夹可以使用dist/folder
    return gulp.src([
        'dist/**/*.{js,css}', 
        'dist/assets/css', 
        'dist/assets/js', 
        'dist/assets/libs', 
        'dist/include', 
        'dist/rev', 
        'dist/assets/img/sprite',
        '!dist/**/main-*-*.{js,css}'
        ])
    .pipe(vinylPaths(del))
})

