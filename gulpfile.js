'use strict';

const
    gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync').create(),
    cleanCSS     = require("gulp-clean-css"),
    concat       = require('gulp-concat'),
    babel        = require("gulp-babel"),
    terser       = require('gulp-terser');

const
    cssFile = [
        'src/css/*.css',
        'src/css/zmedia.css'
    ];

const jsFiles = [
    'src/js/lib/**/*.js',
    'src/js/*.js',
    'src/js/main.js'
];


function styles() {
    return gulp.src(cssFile)
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            cascade: false
        }))

        .pipe(cleanCSS({
            level: 2
        }))

        //конечная папка для стилей
        .pipe(gulp.dest('dist/css'));
}

function Sass() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
}



//Таск на скрипты JS
function scripts() {
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('scripts.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('src/css/**/*.css', styles);
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch("src/scss/**/*.scss", Sass);
    gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('default', watch);