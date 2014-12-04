/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp   = require('gulp'),
    react  = require('gulp-react'),
    notify = require('gulp-notify');

gulp.task('dev_jsx', function () {
    return gulp.src([
        'jsx/tPopKontrZaehl.js'
    ])
        .pipe(react())
        .pipe(gulp.dest('./template'))
        .pipe(notify({ message: 'task dev_jsx beendet' }));
});