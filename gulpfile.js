/**
 * Created by alex on 08.06.2014.
 */
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify');

gulp.task('default', function() {
    gulp.start('styles', 'scripts');
});

gulp.task('styles', function() {
    return gulp.src('style/apflora.css')
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('style'))
        .pipe(notify({message: 'css task beendet'}));
});

gulp.task('scripts', function() {
    return gulp.src(['src/jquery-migrate.js', 'src/jquery-ui.js', 'src/jquery.ui.touch-punch.js', 'src/jquery.cookie.js', 'src/jquery.hotkeys.js', 'src/hammer.js', 'src/jquery.hammer.js', 'src/markerclusterer.js', 'src/markerwithlabel.js', 'src/ruler.js', 'src/jsuri.js', 'src/shapefile/shapefile.js', 'src/shapefile/stream.js', 'src/shapefile/dbf.js', 'src/apflora.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src'))
        .pipe(notify({ message: 'Scripts task beendet' }));
});