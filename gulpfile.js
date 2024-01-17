var gulp = require('gulp');
var sass = require('gulp-sass')(require('node-sass'));
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
sass.compiler = require('node-sass');

gulp.task('agency-scss', async function () {
  return gulp
  .src('./css/scss/magnt/*.scss')
    .pipe(sass())
    .pipe(concat('a_content.css'))
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'compact', // compressed compact expanded
      sourceComments: false // 주석
    }))
    .pipe(gulp.dest('./css/magnt'));
});

gulp.task('user-scss', async function () {
  return gulp
  .src('./css/scss/mptl/*.scss')
    .pipe(sass())
    .pipe(concat('h_content.css'))
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'compact', // compressed compact expanded
      sourceComments: false // 주석
    }))
    .pipe(gulp.dest('./css/mptl'));
});

gulp.task('common-scss', async function () {
  return gulp
  .src('./css/scss/cmm/*.scss')
    .pipe(sass())
    .pipe(concat('c_content.css'))
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'compact', // compressed compact expanded
      sourceComments: false // 주석
    }))
    .pipe(gulp.dest('./css/cmm'));
});

gulp.task('watch', async function () {
  gulp.watch('./css/scss/magnt/*.scss', gulp.series(['agency-scss']));
  gulp.watch('./css/scss/mptl/*.scss', gulp.series(['user-scss']));
  gulp.watch('./css/scss/cmm/*.scss', gulp.series(['common-scss']));
});

gulp.task('default', gulp.series(['agency-scss', 'user-scss', 'common-scss', 'watch']));