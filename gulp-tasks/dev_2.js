/*jslint node: true, browser: true, nomen: true */
'use strict';


var gulp       = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('dev_2', ['dev_style', 'dev_src'], function () {
    gulp.start('watch');
});