var gulp = require('gulp'),
    sftp = require('gulp-sftp'),
    host = '146.185.161.6',
    auth = 'keyMain',
    auth_file = '.ftppass',
    port = 30000;

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