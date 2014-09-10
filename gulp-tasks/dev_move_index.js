var gulp = require('gulp');

gulp.task('dev_move_index', function() {
    return gulp.src('index.html')
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/'));
});