
var gulp = require('gulp')
var runSequence = require('run-sequence');
require('./conf/gulp.dev.conf.js')
require('./conf/gulp.prod.conf.js')


gulp.task('dev', function(cb) {
    runSequence('clean', 'copy', 'includefile', 'includecs', 'server', 'open', 'watch', cb);
});

gulp.task('build', function(){
    runSequence('copy:build', 'includefile:build', 'includecs:build', 'spriter:build', 'jsdir:build', 'rjs:vendor:build',  'cssdir:build', 'htmlmin', 'libsmin', 'imagemin:build', 'delrubbish', 'server:build', 'open:build');
})
