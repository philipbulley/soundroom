var gulp = require('gulp'),
    Q = require('q'),
    ts = require('gulp-typescript'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    copy = require('gulp-copy'),
    fs = require( 'fs-extra'),
    runSequence = require( 'run-sequence' );

var rimraf = Q.denodeify(require('rimraf')),
    mkdir = Q.denodeify( fs.mkdir );

var paths = {
    src: {
        script: ['src/script/spotidrop/*.ts'],
        copy: ['src/index.html', 'src/partials/*.html']
    }
};

/**
 * Call `gulp build` to do a complete build/re-build of files to be deployed
 */
gulp.task( 'build', function( cb )
{
    runSequence( 'buildClean', ['buildCopyStatic', 'scriptApp'], cb );
} );

/**
 * Ensures that the build folder is empty and ready to be built within
 */
gulp.task('buildClean', function () {
    return rimraf('./build')
        .then(function () {
            return mkdir('./build');
        });
});

/**
 * Compile application scripts
 */
gulp.task('scriptApp', function () {
    var tsResult = gulp.src(paths.src.script)
        //.pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(ts({
            //outDir: 'build/js',
            sortOutput: true,
            typescript: require('typescript'),
            target: 'ES5',
            module: 'commonjs',
            emitDecoratorMetadata: true
        }));

    return tsResult.js
        //.pipe(concat('spotidrop.js')) // You can use other plugins that also support gulp-sourcemaps
        //.pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('build/js/spotidrop'));
});

/**
 * Copy static files across as-is.
 */
gulp.task('buildCopyStatic', function () {
    var cwdPaths = paths.src.copy.map(function (path) {
        return path.replace('src/', '');
    });

    return gulp.src(cwdPaths, {cwd: 'src'})
        //.pipe(gulp.dest('./build'));
        .pipe(copy('build'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch(paths.src.script, ['scriptApp']);
    gulp.watch(paths.src.copy, ['buildCopyStatic']);
});