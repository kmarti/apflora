/**
 * Baut das Projekt für die Entwicklung:
 * zuerst mit browserify Module einbinden
 * dann style und src_1 und src_2 (hinter Body)
 * dann watch
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var gulp       = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('dev_2', ['browserify'], function () {
    gulp.start('dev_3');
});