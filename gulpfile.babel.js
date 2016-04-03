import gulp from 'gulp';
import nodemon from 'nodemon';
import path from 'path';
import run from 'run-sequence';
import del from 'del';
import npmPackage from './package.json';


gulp.task('default');

gulp.task('del', (done) => {
    done();
})

gulp.task('mode:development', (done) => {
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
gulp.task('serve:dev', (done) => {
    run('del', 'mode:development', 'nodemon', done);
})