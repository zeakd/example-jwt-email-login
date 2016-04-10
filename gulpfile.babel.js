import gulp from 'gulp';
import mocha from 'gulp-mocha';

import nodemon from 'nodemon';
import path from 'path';
import run from 'run-sequence';
import del from 'del';
import npmPackage from './package.json';


gulp.task('default');

gulp.task('del', done => {
    done();
})

gulp.task('mode:development', done => {
    process.env.NODE_ENV = 'development';
    done();
})

gulp.task('nodemon', () => {
    nodemon({
        execMap: {
            js: 'node'
        },
        script: path.join(__dirname, npmPackage.main),
        watch: [
            './',
            'src/server/'
        ],
        ext: 'js, jsx'
    }).on('restart', function() {
        console.log('... Server Restarted');
    });
})

gulp.task('serve', ['serve:dev']);
gulp.task('serve:dev', done => {
    run('del', 'mode:development', 'nodemon', done);
})

gulp.task('test', () => {
    run('mocha', 'watch-mocha')
})

gulp.task('mocha', done => {
    gulp.src('./test/**/*.js')
        .pipe(mocha({
            reporter: 'nyan',
            globals: {
                should: require('should')
            }
        }))
    done();
})

gulp.task('watch-mocha', () => {
    gulp.watch(['lib/**', 'test/**'], ['mocha']);
});