/**
 * beamt die Dateien aus dem dist-Ordner nach apflora.ch
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var gulp       = require('gulp'),
    sftp       = require('gulp-sftp'),
    requireDir = require('require-dir'),
    sftpPass   = require('../sftpPass.json');

requireDir('../gulp-tasks', {recurse: true});

gulp.task('prod_sftp', function () {
    return gulp.src('dist/**/*')
        .pipe(sftp({
            host: 'apflora.ch',
            port: 31234,
            remotePath: 'apflora',
            user: sftpPass.user,
            pass: sftpPass.pass
        }));
});