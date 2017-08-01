var DEV_HTTP = 'localhost'
var DEV_PORT = 8083;

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var livereload = require('gulp-livereload');
var runSequence = require('run-sequence');
var fileinclude = require('gulp-file-include');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var debug = require('gulp-debug');
var remember = require('gulp-remember');
var cached = require('gulp-cached');


/**
 * 服务器
 */
gulp.task('server', function() {
    connect.server({
        livereload: {
            port:35730
        },
        port: DEV_PORT,
        hostname: '0.0.0.0',
        root: './dist'
    });
});

/**
 * 打开浏览器
 */
gulp.task('open', function() {
    gulp.src('').pipe(open({
        uri: 'http://' + DEV_HTTP + ':' + DEV_PORT
    }));
});

/**
 * 清理dist文件夹
 */
gulp.task('clean', function(){
    return gulp.src('dist')
    .pipe(plumber())
    .pipe(clean())
})

/**
 * 增量：复制
 */
gulp.task('copy', function() {
    return gulp.src(['src/**', '!src/include', '!src/include/*'])
    .pipe(plumber())
    .pipe(changed('dist'))
    .pipe(debug({title:'复制:'}))
    .pipe(gulp.dest('dist'))
});


/**
 * 增量：编译模板
 */
gulp.task('includefile', function() {
    return gulp.src(['src/**/*.{html, tpl}', '!src/include', '!src/include/*'])
    .pipe(plumber())
    .pipe(cached('includefile'))
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(debug({title:'编译HTML:'}))
    .pipe(gulp.dest('dist'))
    .pipe(remember('includefile'))
});


/**
 * 增量：利用fileinclude实现css模块化
 */
gulp.task('includecs', function() {
    return gulp.src(['src/**/*.css', '!src/assets/common/*.css'])
    .pipe(plumber())
    .pipe(cached('includecs'))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(debug({title:'编译CSS:'}))
    .pipe(gulp.dest('dist'))
    .pipe(remember('includecs'))
});



/**
 * 增量监听
 */
gulp.task('watch', function() {
    livereload.listen(35730);
    gulp.watch('src/**', function(file) {
        var gulp = require('gulp')
        var runSequence = require('run-sequence').use(gulp);
        runSequence('copy', 'includefile', 'includecs');
        setTimeout(function(){
            livereload.reload(file.path);
        }, 1000);
    });
});
