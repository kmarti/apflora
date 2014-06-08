/**
 * Created by alex on 08.06.2014.
 */
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('style', function() {
    return gulp.src('style/apflora.css')
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/style'))
        .pipe(notify({message: 'css task beendet'}));
});

gulp.task('scripts_all', function() {
    return gulp.src('src/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/src'))
        .pipe(notify({ message: 'Scripts task beendet' }));
});

gulp.task('script_apflora', function() {
    return gulp.src('src/apflora.js')
        //.pipe(concat('apflora.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/src'))
        .pipe(notify({ message: 'Scripts task beendet' }));
});