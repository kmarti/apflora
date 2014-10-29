/*jslint node: true, browser: true, nomen: true */
'use strict';


var gulp   = require('gulp'),
    concat = require('gulp-concat-sourcemap'),
    notify = require('gulp-notify');

gulp.task('dev_src', function() {
    return gulp.src([
            'src/jquery-ui.js',
            'src/jquery.ui.touch-punch.js',
            'src/jquery.cookie.js',
            'src/jquery.hotkeys.js',
            'src/hammer.js',
            'src/jquery.hammer.js',
            'src/markerclusterer.js',
            'src/markerwithlabel.js',
            'src/ruler.js',
            'src/jsuri.js',
            'src/jquery.qtip.js',
            'src/proj4.js',
            'src/jquery.fileDownload.js',
            'src/apflora_browserified.js',
            'src/jquery.file.download.js',
            'src/underscore.js'
        ])
        .pipe(concat('apflora_built.js'))
        .pipe(gulp.dest('./src'))
        .pipe(notify({ message: 'task dev_src beendet' }));
});