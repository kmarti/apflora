var gulp = require('gulp'),
    clean = require('gulp-clean');

gulp.task('dev_clean_src', function() {
    return gulp.src(['../programme/xampp/htdocs/apflora/src/*'], {read: false})
        .pipe(clean({force: true}));
});