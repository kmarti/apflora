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
            'src/apflora.js',
            'index.html'
        ],
        ['dev_when_watch']
    );
    gulp.watch(
        ['style/apflora.css'],
        ['dev_style']
    );
});