/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var gulp  = require('gulp');
var shell = require('gulp-shell');

return gulp.task('npm_start', shell.task([
    'npm start'
]));