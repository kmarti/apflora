'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat-sourcemap'),
    notify = require('gulp-notify');

gulp.task('dev_style', function() {
    return gulp.src([
    		'style/jquery.qtip.css',
    		'style/apflora.css'
		])
        .pipe(concat('apflora_built.css'))
        .pipe(gulp.dest('style'))
        .pipe(notify({message: 'task dev_style beendet'}));
});