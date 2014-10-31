var gulp = require('gulp');

gulp.task('prod_copy_shp_to_dist', function () {
    return gulp.src('shp/*')
        .pipe(gulp.dest('dist/shp'));
});