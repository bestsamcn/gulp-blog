var DEV_HTTP = 'localhost'
var DEV_PORT = 8081;

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
var plumber = require('gulp-plumber');

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
 * 复制全部
 */
gulp.task('clean', function(){
    return gulp.src('dist')
    .pipe(plumber())
    .pipe(clean())
})

gulp.task('copy:all', ['clean'], function() {
    var src = 'src/**/*';
    var build = 'dist';
    return gulp.src(src)
    .pipe(plumber())
    .pipe(gulp.dest(build));
});

gulp.task('copy:watch', function() {
    var src = 'src/**/*';
    var build = 'dist';
    return gulp.src(src)
    .pipe(plumber())
    .pipe(gulp.dest(build));
});

/**
 * 复制图片
 */
gulp.task('copy:img', function() {
    var src = 'src/img/*';
    var build = 'dist/img';
    return gulp.src(src)
    .pipe(plumber())
    .pipe(gulp.dest(build));
});

/**
 * 编译模板
 */
gulp.task('template', function() {
    return gulp.src('dist/**/*.html')
    .pipe(plumber())
    .pipe(fileinclude({
        prefix: '@@',
        suffix:'@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest('dist'))
});

/**
 * 雪碧图，拷贝图片-压缩css-雪碧图
 */
gulp.task('delsprite', function(){
    return gulp.src(['dist/img/sprite/sprite_icon_*.png'])
    .pipe(plumber())
    .pipe(vinylPaths(del))
})
gulp.task('spriter', ['delsprite'], function(){
    var timestamp = +new Date();
    return gulp.src('dist/**/*.css')
    .pipe(plumber())
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
 * 利用fileinclude实现js模块化
 */
gulp.task('includejs', function() {
    return gulp.src('dist/**/*.js')
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root'
    }))
    .pipe(gulp.dest('dist'));
});

/**
 * 利用fileinclude实现css模块化
 */
gulp.task('includecs', function() {
    return gulp.src('dist/**/*.css')
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@@',
      basepath: '@root'
    }))
    .pipe(gulp.dest('dist'));
});

/**
 * 监听
 */
gulp.task('watch', function() {
    livereload.listen(35730);
    gulp.watch('src/**', function(file) {
        runSequence('copy:watch', 'template', 'includejs', 'includecs' , function(){
            setTimeout(livereload.reload(file.path),1000);
        });
    });
});