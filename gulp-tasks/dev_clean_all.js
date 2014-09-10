var gulp = require('gulp'),
    clean = require('gulp-clean');

gulp.task('dev_clean_all', function() {
    return gulp.src(['../programme/xampp/htdocs/apflora/src/*', '../programme/xampp/htdocs/apflora/geojson/*', '../programme/xampp/htdocs/apflora/style/*', '../programme/xampp/htdocs/apflora/php/*', '../programme/xampp/htdocs/apflora/index.html'], {read: false})
        .pipe(clean({force: true}));
});