/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp         = require('gulp'),
    handlebars   = require('gulp-handlebars'),
    defineModule = require('gulp-define-module'),
    notify       = require('gulp-notify');

gulp.task('templates', function () {
    return gulp.src('src/templates_dev/*.hbs')
        .pipe(handlebars())
        .pipe(defineModule('node'))
        .pipe(gulp.dest('./src/templates'))
        .pipe(notify({ message: 'task templates beendet' }));
});