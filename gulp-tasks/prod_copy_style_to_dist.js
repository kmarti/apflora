var gulp = require('gulp');

gulp.task('prod_copy_style_to_dist', function () {
    return gulp.src('style/**/*')
        .pipe(gulp.dest('dist/style'));
});