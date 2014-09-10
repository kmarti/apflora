var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

gulp.task('dev_move_all', ['dev_clean_all'], function() {
    gulp.start('dev_move_index', 'dev_move_src', 'dev_move_geojson', 'dev_move_style', 'dev_move_php');
});