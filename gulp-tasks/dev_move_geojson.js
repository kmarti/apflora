var gulp = require('gulp');

gulp.task('dev_move_geojson', function() {
    return gulp.src(['geojson/*'])
        .pipe(gulp.dest('../programme/xampp/htdocs/apflora/geojson'));
});