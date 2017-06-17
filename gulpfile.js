
var gulp = require('gulp')
var runSequence = require('run-sequence');
require('./conf/gulp.dev.conf.js')
require('./conf/gulp.prod.conf.js')


gulp.task('dev', function(cb) {
    runSequence('clean', 'copy', 'includefile', 'includecs', 'server', 'open', 'watch', cb);
});

gulp.task('build', function(){
    runSequence('copy:build', 'includefile:build', 'includecs:build', 'spriter:build', 'jsdir:build', 'cssdir:build', 'htmlmin', 'imagemin:build', 'delrubbish', 'server:build', 'open:build');
})
