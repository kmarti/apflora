var gulp = require('gulp'),
    clean = require('gulp-clean');

gulp.task('dev_clean_index', function() {
    return gulp.src(['../programme/xampp/htdocs/apflora/index.html'], {read: false})
        .pipe(clean({force: true}));
});