
var gulp = require('gulp')
var runSequence = require('run-sequence');
require('./conf/gulp.dev.conf.js')
require('./conf/gulp.prod.conf.js')


gulp.task('dev', function() {
    runSequence('clean', 'copy', 'includehtml', 'includejs', 'includecss', 'server', 'open', 'watch');
});

gulp.task('build', function(){
    runSequence('copy:build', 'includehtml:build', 'jsdir:build', 'cssdir:build', 'spriter:build', 'imagemin:build', 'delrubbish', 'server:build', 'open:build');
})
