const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const mode = require('gulp-mode')();

gulp.task('process-sass', () => {
    return gulp.src('src/scss/index.scss')
        .pipe(mode.development(sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%']
        }))
        .pipe(cssnano())
        .pipe(mode.development(sourcemaps.write()))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('process-js', () => {
    return gulp.src('src/js/index.js')
        .pipe(webpack({
            mode: mode.development() ? 'development' : 'production',
            watch: true,
            output: {
                filename: 'bundle.js'
            }
        }))
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(mode.development(sourcemaps.init()))
        .pipe(uglify().on('error', (uglify) => {
            console.error(uglify.message);
            this.emit('end');
        }))
        .pipe(mode.development(sourcemaps.write()))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('default', () => {

    gulp.watch(
        ['src/scss/*.scss','src/scss/*/*.scss'],
        { ignoreInitial: false },
        gulp.series('process-sass')
    );

    gulp.watch(
        ['src/js/*.js','src/js/*/*.js'],
        { ignoreInitial: false },
        gulp.series('process-js')
    );

});