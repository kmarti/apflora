var gulp = require('gulp');

gulp.task('prod_copy_src_themes_to_dist', function () {
    return gulp.src('src/themes/**/*')
        .pipe(gulp.dest('dist/src/themes'));
});