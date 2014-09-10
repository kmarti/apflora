var gulp = require('gulp');

gulp.task('dev_build_php', function() {
    return gulp.src(['php/*'])
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/php'));
});