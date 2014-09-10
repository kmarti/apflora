var gulp = require('gulp'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');

gulp.task('dev_build_style', function() {
    return gulp.src(['style/jquery.qtip.css', 'style/apflora.css'])
        .pipe(concat('main.css'))
        .pipe(gulp.dest('style'))
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/style'))
        .pipe(notify({message: 'dev_build_style task beendet'}));
});