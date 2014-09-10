var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('dev_move_php', function() {
    return gulp.src('php/*')
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/php'))
        .pipe(connect.reload());
});