/*jslint node: true, browser: true, nomen: true, todo: true */
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
            'prod_copy_geojson_to_dist',
            'prod_copy_queries_to_dist',
            'prod_copy_src_lib_to_dist',
            'prod_copy_src_modules_to_dist',
            'prod_copy_src_templates_to_dist',
            'prod_copy_src_themes_to_dist',
            'prod_copy_src_to_dist',
            'prod_copy_shp_to_dist',
            'prod_copy_img_to_dist',
            'prod_copy_kml_to_dist',
            'prod_copy_etc_to_dist',
            'prod_copy_root_to_dist',
            'prod_copy_style_to_dist'
        ]);
    }
);