'use strict';

var gulp = require('gulp');

return gulp.task('watch', function() {
    gulp.watch(
        [
            'geojson/*',
            'img/*',
            'kml/*',
            'queries/*',
            'queries/tree/*',
            'queries/export/*',
            'shp/*',
            'src/apflora.js',
            'src/lib/*',
            'src/modules/*',
            'index.html',
            'server.js'
        ],
        ['dev_when_watch']
    );
    gulp.watch([
        'style/apflora.css',
        'dev_style'
    ]);
});