var gulp   = require('gulp'),
    clean  = require('gulp-clean'),
    notify = require('gulp-notify');

gulp.task('prod_clean_dist', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean())
        .pipe(notify({ message: 'clean dist task beendet' }));
});