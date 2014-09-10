var gulp = require('gulp');

return gulp.task('watch', function() {
    gulp.watch(['src/*', '-src/main.js'], ['dev_build_src']);
    gulp.watch(['style/*', '-style/main.css'], ['dev_build_style']);
    gulp.watch(['php/*'], ['dev_build_php']);
    gulp.watch(['index.html'], ['dev_move_index']);
});