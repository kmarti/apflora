var gulp       = require('gulp'),
    minifyHTML = require('gulp-minify-html'),
    notify     = require('gulp-notify');

gulp.task('prod_build_html', function() {
    return gulp.src('index.html')
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'prod_build_html task beendet' }));
});