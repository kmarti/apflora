var gulp = require('gulp');

gulp.task('dev_move_style', function() {
    return gulp.src(['style/*', 'style/images/*'], {base: 'style/'})
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/style'));
});