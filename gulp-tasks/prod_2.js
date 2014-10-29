/*jslint node: true, browser: true, nomen: true */
'use strict';


var gulp = require('gulp'),
    requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task(
    'prod_2',
    [
        'prod_build_style',
        'prod_build_src',
        'prod_build_html'
    ],
    function () {
        gulp.start([
            'dev_copy_xampp',
            'prod_copy_geojson_to_dist',
            'prod_copy_queries_to_dist',
            'prod_copy_shp_to_dist',
            'prod_copy_img_to_dist',
            'prod_copy_kml_to_dist'
        ]);
    }
);