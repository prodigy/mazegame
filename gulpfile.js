var gulp = require('gulp');
var util = require('gulp-util');
var gulpif = require('gulp-if');

var sourcemaps = require('gulp-sourcemaps');

var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var postcss = require('gulp-postcss');
var postcssImport = require('postcss-import');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var prod = util.env.production;

var paths = {
    src: {
        scripts: ['src/js/**/*.js'],
        styles: ['src/scss/**/*.scss']
    },
    dist: {
        scripts: 'dist/js/',
        styles: 'dist/css/'
    }
};

gulp.task('uglify',
    function() {
        return gulp.src(paths.src.scripts)
            .pipe(gulpif(!prod, sourcemaps.init()))
            .pipe(concat('game.min.js'))
            .pipe(gulpif(prod, uglify()))
            .pipe(gulpif(!prod, sourcemaps.write()))
            .pipe(gulp.dest(paths.dist.scripts));
    });

gulp.task('sass',
    function () {
        var procs = [
            postcssImport,
            autoprefixer
        ];
        if (prod)
            procs.push(cssnano);

        return gulp.src(paths.src.styles)
            .pipe(sassGlob())
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss(procs))
            .pipe(gulp.dest(paths.dist.styles));
    });

gulp.task('watchInternal',
    function () {
        gulp.watch(paths.src.styles, ['sass']);
        gulp.watch(paths.src.scripts, ['uglify']);
    });

gulp.task('build', ['sass', 'uglify']);

gulp.task('watch', ['build', 'watchInternal']);

gulp.task('default', ['build']);