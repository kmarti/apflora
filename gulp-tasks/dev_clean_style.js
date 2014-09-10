var gulp = require('gulp'),
    clean = require('gulp-clean');

gulp.task('dev_clean_style', function() {
    return gulp.src(['../programme/xampp/htdocs/apflora/style/*'], {read: false})
        .pipe(clean({force: true}));
});