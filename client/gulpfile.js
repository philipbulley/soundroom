var gulp = require('gulp'),
  Q = require('q'),
  ts = require('gulp-typescript'),
  //concat = require('gulp-concat'),
  //sourcemaps = require('gulp-sourcemaps'),
  copy = require('gulp-copy'),
  fs = require('fs-extra'),
  runSequence = require('run-sequence');

var rimraf = Q.denodeify(require('rimraf')),
  mkdir = Q.denodeify(fs.mkdir);

var paths = {
  dynamicFiles: [
    'soundroom/*.ts',
    'soundroom/**/*.ts'
  ],

  staticFiles: [
    'index.html',
    'soundroom/!(*.ts)',
    'soundroom/**/!(*.ts)'
  ],

  vendor: [
    'node_modules/es6-shim/es6-shim.js',
    'node_modules/systemjs/dist/system-polyfills.js',

    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/rxjs/bundles/Rx.js',
    'node_modules/angular2/bundles/angular2.dev.js',
    'node_modules/angular2/bundles/router.dev.js'
  ]
};

/**
 * Call `gulp build` to do a complete build/re-build of files to be deployed
 */
gulp.task('build', function (cb) {
  runSequence('buildClean', ['buildCopyStatic', 'buildCopyVendor', 'scriptApp'], cb);
});

/**
 * Ensures that the build folder is empty and ready to be built within
 */
gulp.task('buildClean', function () {
  return rimraf('./build/*');
  //.then(function () {
  //  return mkdir('./build');
  //});
});


/**
 * Compile application scripts
 */
gulp.task('scriptApp', function () {
  var tsProject = ts.createProject('tsconfig.json');
  var tsResult = tsProject.src()
    //.pipe(sourcemaps.init()) // This means sourcemaps will be generated
    .pipe(ts(tsProject));

  return tsResult.js
    //.pipe(concat('soundroom.js')) // You can use other plugins that also support gulp-sourcemaps
    //.pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
    .pipe(gulp.dest('build'));
});


//gulp.task('scriptVendor', function() {
//  return gulp.src([
//    'node_modules/es6-shim/es6-shim.js',
//    'node_modules/systemjs/dist/system-polyfills.js',
//
//    'node_modules/angular2/bundles/angular2-polyfills.js',
//    'node_modules/systemjs/dist/system.src.js',
//    'node_modules/rxjs/bundles/Rx.js',
//    'node_modules/angular2/bundles/angular2.dev.js',
//    'node_modules/angular2/bundles/router.dev.js'
//  ])
//    .pipe(concat('vendor.js'))
//    .pipe(gulp.dest('./build/js'));
//});

/**
 * Copy static files across as-is.
 */
gulp.task('buildCopyStatic', function () {
  return gulp.src(paths.staticFiles)
    .pipe(copy('build'));
});

gulp.task('buildCopyVendor', function () {
  var cwdPaths = paths.vendor.map(function (path) {
    return path.replace('node_modules/', '');
  });

  return gulp.src(cwdPaths, {cwd: 'node_modules'})
    .pipe(copy('build/vendor'));
});

gulp.task('watch', ['build'], function () {
  gulp.watch(paths.dynamicFiles, ['scriptApp']);
  gulp.watch(paths.staticFiles, ['buildCopyStatic']);


});