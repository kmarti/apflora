var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');

gulp.task('prod_build_src', function() {
    return gulp.src(['src/jquery-ui.js', 'src/jquery.ui.touch-punch.js', 'src/jquery.cookie.js', 'src/jquery.hotkeys.js', 'src/hammer.js', 'src/jquery.hammer.js', 'src/markerclusterer.js', 'src/markerwithlabel.js', 'src/ruler.js', 'src/jsuri.js', 'src/jquery.qtip.js', 'src/proj4.js', 'src/jquery.fileDownload.js', 'src/apflora.js', 'src/jquery.file.download.js', 'src/underscore.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src'))
        .pipe(notify({ message: 'prod_build_src task beendet' }));
});