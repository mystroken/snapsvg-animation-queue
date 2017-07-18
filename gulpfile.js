var gulp = require('gulp');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCss = require('gulp-clean-css');


gulp.task('scripts', function() {
    gulp.src('./snap-animation-queue.js')
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('./dist'))
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});


gulp.task('default', ['scripts']);