var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

gulp.task('prod', ['prod_build_style', 'prod_build_src'], function() {
    gulp.start('dev_move_all', 'prod_sftp');
});