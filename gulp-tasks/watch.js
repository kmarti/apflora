'use strict';

var gulp = require('gulp');

return gulp.task('watch', function() {
    gulp.watch(
        [
            'geojson/*',
            'img/*',
            'kml/*',
            'queries/*',
            'serverMethods/*',
            'shp/*',
            'src/*',
            '-src/app.js',
            '-src/main.js',
            'index.html'
        ],
        ['dev']
    );
    gulp.watch(
        [
            'style/*',
            '-style/main.css'
        ],
        ['dev_style']
    );
    // browserify soll wissen, das gewatched wird
    global.isWatching = true;
});