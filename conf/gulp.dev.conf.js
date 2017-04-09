var DEV_HTTP = 'localhost'
var DEV_PORT = 8081;

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
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var spriter = require('gulp-css-spriter');
var fileinclude = require('gulp-file-include');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');

var changed = require('gulp-changed');
var cached = require('gulp-cached');
var remember = require('gulp-cached');
var debug = require('gulp-debug');

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
 * 清理dist
 */
gulp.task('clean', function(){
    return gulp.src('dist')
    .pipe(plumber())
    .pipe(clean())
})

/**
 * 复制到dist
 */
gulp.task('copy', function() {
    return gulp.src('src/**/*')
    .pipe(plumber())
    .pipe(changed('dist'))
    .pipe(debug({title:'复制：'}))
    .pipe(gulp.dest('dist'))
});


/**
 * 编译html模板
 */
gulp.task('includehtml', function() {
    return gulp.src(['dist/**/*.html', '!dist/assets/libs/**/*.html'])
    .pipe(plumber())
    .pipe(cached('includehtml'))
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(debug({title:'编译HTML：'}))
    .pipe(gulp.dest('dist'))
    .pipe(remember('includehtml'))
});


/**
 * 引入js
 */
gulp.task('includejs', function() {
    return gulp.src(['dist/**/*.js','!dist/assets/libs/**/*.js'])
    .pipe(plumber())
    .pipe(cached('includejs'))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(debug({title:'编译JS：'}))
    .pipe(gulp.dest('dist'))
    .pipe(remember('includejs'))
});

/**
 * 引入css
 */
gulp.task('includecss', function() {
    return gulp.src(['dist/**/*.css','!dist/assets/libs/**/*.css'])
    .pipe(plumber())
    .pipe(cached('includecss'))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(debug({title:'编译CSS：'}))
    .pipe(gulp.dest('dist'))
    .pipe(remember('includecss'))
});

/**
 * 监听
 */
gulp.task('watch', function() {
    livereload.listen(35730);
    gulp.watch('src/**', function(file) {
        runSequence('copy', 'includehtml', 'includejs', 'includecss' , function(){
            setTimeout(livereload.reload(file.path),1000);
        });
    });
});