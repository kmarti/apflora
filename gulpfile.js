/**
 * Created by alex on 08.06.2014.
 */
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    sftp = require('gulp-sftp'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    changed = require('gulp-changed'),// aber wie schafft man es, dass sftp nur seit dem letzten sftp geänderte uploaded?
    host = '146.185.161.6',
    auth = 'keyMain',
    auth_file = '.ftppass',
    port = 30000;

// connect klappt zwar, aber mysql liefert auf :4242 keine Daten???
gulp.task('default', ['dev_build_all'], function() {
    gulp.start('watch');
});

gulp.task('prod', ['prod_build_style', 'prod_build_src'], function() {
    gulp.start('dev_move_all', 'prod_sftp');
});

gulp.task('dev_build_all', ['dev_build_style', 'dev_build_src', 'dev_build_php'], function() {
    gulp.start('dev_move_all');
 });

gulp.task('dev_move_all', ['dev_clean_all'], function() {
    gulp.start('dev_move_index', 'dev_move_src', 'dev_move_geojson', 'dev_move_style', 'dev_move_php');
 });

gulp.task('prod_sftp', ['prod_sftp_index', 'prod_sftp_src', 'prod_sftp_geojson', 'prod_sftp_style', 'prod_sftp_php']);

gulp.task('prod_build_style', function() {
    return gulp.src(['style/jquery.qtip.css', 'style/apflora.css'])
        .pipe(concat('main.css'))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(gulp.dest('style'))
        .pipe(notify({message: 'prod_build_style task beendet'}));
});

gulp.task('dev_build_style', function() {
    return gulp.src(['style/jquery.qtip.css', 'style/apflora.css'])
        .pipe(concat('main.css'))
        .pipe(gulp.dest('style'))
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/style'))
        .pipe(notify({message: 'dev_build_style task beendet'}));
});

gulp.task('prod_build_src', function() {
    return gulp.src(['src/jquery-ui.js', 'src/jquery.ui.touch-punch.js', 'src/jquery.cookie.js', 'src/jquery.hotkeys.js', 'src/hammer.js', 'src/jquery.hammer.js', 'src/markerclusterer.js', 'src/markerwithlabel.js', 'src/ruler.js', 'src/jsuri.js', 'src/jquery.qtip.js', 'src/proj4.js', 'src/apflora.js', 'src/jquery.file.download.js', 'src/underscore.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src'))
        .pipe(notify({ message: 'prod_build_src task beendet' }));
});

gulp.task('dev_build_src', function() {
    return gulp.src(['src/jquery-ui.js', 'src/jquery.ui.touch-punch.js', 'src/jquery.cookie.js', 'src/jquery.hotkeys.js', 'src/hammer.js', 'src/jquery.hammer.js', 'src/markerclusterer.js', 'src/markerwithlabel.js', 'src/ruler.js', 'src/jsuri.js', 'src/jquery.qtip.js', 'src/proj4.js', 'src/apflora.js', 'src/jquery.file.download.js', 'src/underscore.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('src'))
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/src'))
        .pipe(notify({ message: 'dev_build_src task beendet' }));
});

gulp.task('dev_build_php', function() {
    return gulp.src(['php/*'])
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/php'));
});

gulp.task('prod_sftp_src', function() {
    return gulp.src('src/*')
        .pipe(sftp({
            host: host,
            auth: auth,
            authFile: auth_file,
            port: port,
            remotePath: '/var/zpanel/hostdata/zadmin/public_html/apflora_ch/src'
        }));
});

gulp.task('dev_move_src', function() {
    return gulp.src(['src/**', 'src/shp/*'/*, 'src/theme/**'*/, 'src/themes/**'], {base: 'src/'})
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/src'));
});

gulp.task('prod_sftp_geojson', function() {
    return gulp.src('geojson/*')
        .pipe(sftp({
            host: host,
            auth: auth,
            authFile: auth_file,
            port: port,
            remotePath: '/var/zpanel/hostdata/zadmin/public_html/apflora_ch/geojson'
        }));
});

gulp.task('dev_move_geojson', function() {
    return gulp.src(['geojson/*'])
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/geojson'));
});

gulp.task('dev_clean_all', function() {
    return gulp.src(['../programme/xampp/htdocs/apflora/src/*', '../programme/xampp/htdocs/apflora/geojson/*', '../programme/xampp/htdocs/apflora/style/*', '../programme/xampp/htdocs/apflora/php/*', '../programme/xampp/htdocs/apflora/index.html'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('dev_clean_style', function() {
    return gulp.src(['../programme/xampp/htdocs/apflora/style/*'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('dev_clean_src', function() {
    return gulp.src(['../programme/xampp/htdocs/apflora/src/*'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('dev_clean_index', function() {
    return gulp.src(['../programme/xampp/htdocs/apflora/index.html'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('prod_sftp_style', function() {
    return gulp.src('style/*')
        .pipe(sftp({
            host: host,
            auth: auth,
            authFile: auth_file,
            port: port,
            remotePath: '/var/zpanel/hostdata/zadmin/public_html/apflora_ch/style'
        }));
});

gulp.task('dev_move_style', function() {
    return gulp.src(['style/*', 'style/images/*'], {base: 'style/'})
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/style'));
});

gulp.task('prod_sftp_php', function() {
    return gulp.src('php/*')
        .pipe(sftp({
            host: host,
            auth: auth,
            authFile: auth_file,
            port: port,
            remotePath: '/var/zpanel/hostdata/zadmin/public_html/apflora_ch/php'
        }));
});

gulp.task('dev_move_php', function() {
    return gulp.src('php/*')
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/php'))
        .pipe(connect.reload());
});

gulp.task('prod_sftp_index', function() {
    return gulp.src('index.html')
        .pipe(sftp({
            host: host,
            auth: auth,
            authFile: auth_file,
            port: port,
            remotePath: '/var/zpanel/hostdata/zadmin/public_html/apflora_ch/'
        }));
});

gulp.task('dev_move_index', function() {
    return gulp.src('index.html')
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/'));
});

/*// siehe hier: http://symmetrycode.com/super-simple-static-server-in-gulp
// aber klappt leider nicht
gulp.task('connect', function() {
    connect.server({
        root: '../programme/xampp/htdocs/apflora/',
        port: 4242,
        livereload: true
    });
});*/

gulp.task('watch', function() {
    //gulp.watch(['**', '-src/main.js', '-style/main.css'], ['dev_build_all']);
    gulp.watch(['src/*', '-src/main.js'], ['dev_build_src']);
    gulp.watch(['style/*', '-style/main.css'], ['dev_build_style']);
    gulp.watch(['php/*'], ['dev_build_php']);
    gulp.watch(['index.html'], ['dev_move_index']);
});