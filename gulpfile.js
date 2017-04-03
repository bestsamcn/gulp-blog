
var gulp = require('gulp')
var runSequence = require('run-sequence');
require('./conf/gulp.dev.conf.js')
require('./conf/gulp.prod.conf.js')


gulp.task('default', function() {
    runSequence('copy:all', 'template', 'includejs', 'includecs' , 'spriter','server', 'open', 'watch');
});

gulp.task('build', function(){
    runSequence('copy:build', 'template:build', 'includejs:build', 'includecs:build', 'spriter:build', 'jsmin:build', 'cssmin:build', 'imagemin:build', 'delrubbish', 'server:build', 'open:build');
})
