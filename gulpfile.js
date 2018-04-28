"use strict";

var gulp         = require('gulp');
var postcss      = require('postcss');
var gulp_postcss = require('gulp-postcss');
var px2rem       = require('postcss-px2rem');
var rename       = require('gulp-rename');
var csswring     = require('csswring');
var cssimport    = require('postcss-import');
var autoprefixer = require('autoprefixer');
var nested       = require('postcss-nested');
var sourcemaps   = require('gulp-sourcemaps');
var VersionPlugin= require('./gulp/version-plugin');
var packageFile  = require('./package.json');
gulp.task('postcss', function(){
  var processors = [
    cssimport,
    nested,
    px2rem({ remUnit: 64 }),
    autoprefixer({browsers: ['> 1%', 'last 2 version']}),
    csswring({
      preserveHacks: true,
      removeAllComments: true
    })
  ];
  return gulp.src('./css/main.css')
          //.pipe(sourcemaps.init())
          .pipe(gulp_postcss(processors))
          .on('error', errorHandler)
          .pipe(rename({suffix: ".min"}))
          //.pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('./css/'));
});

gulp.task('version', function(){
  return gulp.src('./pages/**/*.html')
          .pipe(VersionPlugin({
            v: packageFile.version
          }))
          .pipe(gulp.dest('./pages'));
});


gulp.task('watch', function () {
    gulp.watch([
      './css/**/*.css',
      '!./css/main.min.css',
      '!./css/main.min.css.map'
    ], ['postcss']);
});

// Main stask
gulp.task('default', ['postcss','watch']);

function errorHandler(error){
  console.log(error);
  this.emit('end');
}
