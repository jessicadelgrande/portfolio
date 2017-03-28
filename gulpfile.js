const gulp = require('gulp');
const babel = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const historyApiFallback = require('connect-history-api-fallback');

gulp.task('styles', () => {
    return gulp.src('./dev/styles/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error',notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in CSS 💀'
        })))
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('javascript', () => {
    browserify('dev/scripts/script.js', {debug: true})
        .transform('babelify', {
            sourceMaps: true,
            presets: ['es2015','react']
        })
        .bundle()
        .on('error',notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in JS 💀'
        }))
        .pipe(source('scripts/script.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public'))
        .pipe(reload({stream:true}));
});

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: './'
        },
        middleware: [historyApiFallback()]
    });
});

gulp.task('watch', () => {
    gulp.watch('./dev/**/*.js', ['javascript']);
    gulp.watch('./dev/styles/**/*.scss', ['styles']);
    gulp.watch('./*.html', reload);
});

gulp.task('default', ['browserSync', 'styles', 'javascript', 'watch'])