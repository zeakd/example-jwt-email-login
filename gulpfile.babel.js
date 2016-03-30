import gulp from 'gulp';
import nodemon from 'nodemon';
import path from 'path';
import npmPackage from './package.json';


gulp.task('default');

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