var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

gulp.task('prod_sftp', ['prod_sftp_index', 'prod_sftp_src', 'prod_sftp_geojson', 'prod_sftp_style', 'prod_sftp_php']);