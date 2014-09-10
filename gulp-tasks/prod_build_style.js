var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');

gulp.task('prod_build_style', function() {
    return gulp.src(['style/jquery.qtip.css', 'style/apflora.css'])
        .pipe(concat('main.css'))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(gulp.dest('style'))
        .pipe(notify({message: 'prod_build_style task beendet'}));
});