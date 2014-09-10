var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

gulp.task('dev_build_all', ['dev_build_style', 'dev_build_src', 'dev_build_php'], function() {
    gulp.start('dev_move_all');
});