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
    notify = require('gulp-notify'),
    sftp = require('gulp-sftp');

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

gulp.task('sftp', function() {
    gulp.start('sftp_', 'sftp_src', 'sftp_style', 'sftp_php');
});

gulp.task('sftp_src', function () {
    return gulp.src('src/*')
        .pipe(sftp({
            host: '146.185.161.6',
            auth: 'keyMain',
            authFile: '.ftppass',
            port: 30000,
            remotePath: '/var/zpanel/hostdata/zadmin/public_html/apflora_ch/src'
        }));
});

gulp.task('sftp_style', function () {
    return gulp.src('style/*')
        .pipe(sftp({
            host: '146.185.161.6',
            auth: 'keyMain',
            authFile: '.ftppass',
            port: 30000,
            remotePath: '/var/zpanel/hostdata/zadmin/public_html/apflora_ch/style'
        }));
});

gulp.task('sftp_php', function () {
    return gulp.src('php/*')
        .pipe(sftp({
            host: '146.185.161.6',
            auth: 'keyMain',
            authFile: '.ftppass',
            port: 30000,
            remotePath: '/var/zpanel/hostdata/zadmin/public_html/apflora_ch/php'
        }));
});

gulp.task('sftp_', function () {
    return gulp.src('index.html')
        .pipe(sftp({
            host: '146.185.161.6',
            auth: 'keyMain',
            authFile: '.ftppass',
            port: 30000,
            remotePath: '/var/zpanel/hostdata/zadmin/public_html/apflora_ch/'
        }));
});