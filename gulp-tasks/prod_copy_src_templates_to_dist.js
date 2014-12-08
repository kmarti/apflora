var gulp = require('gulp');

gulp.task('prod_copy_src_templates_to_dist', function () {
    return gulp.src('src/templates/**/*')
        .pipe(gulp.dest('dist/src/templates'));
});