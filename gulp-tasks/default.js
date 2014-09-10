var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

// connect klappt zwar, aber mysql liefert auf :4242 keine Daten???
gulp.task('default', ['dev_build_all'], function() {
    gulp.start('watch');
});