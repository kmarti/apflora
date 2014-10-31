var gulp = require('gulp');

gulp.task('prod_copy_src_modules_to_dist', function () {
    return gulp.src('src/modules/**/*')
        .pipe(gulp.dest('dist/src/modules'));
});