var gulp = require('gulp');

gulp.task('dev_move_src', function() {
    return gulp.src(['src/**', 'src/shp/*'/*, 'src/theme/**'*/, 'src/themes/**'], {base: 'src/'})
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/src'));
});