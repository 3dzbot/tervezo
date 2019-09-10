const gulp = require('gulp');
const sass = require('gulp-sass');
// const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
// var rename = require('gulp-rename');
// var uglify = require('gulp-uglify');//оптимизатор script
// var concat = require('gulp-concat');//объединение script
const autoprefixer = require('gulp-autoprefixer');
// const cleanCSS = require('gulp-clean-css');
const babel = require("gulp-babel");

let path = {
    src:{
        styleSCSS: "./src/scss/style.scss",
        style: "./src/style/style.css",
        script: "./src/script/**/*.js",
        html: "./src/**/*.html",
    },
    dist:{
        styleSCSS: "./src/style",
        style: "./dist",
        script: "./dist",
        html: "./",
    }
};

sass.compiler = require('node-sass');

function sassFn(){
    return gulp.src(path.src.styleSCSS)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.dist.styleSCSS))
}

function styles(){
    return gulp.src(path.src.style)
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(cleanCSS({level: 2}))
        .pipe(gulp.dest(path.dist.style))
}

function html() {
    return gulp.src(path.src.html)
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(path.dist.html));
}

function scripts() {
    return gulp.src(path.src.script)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(path.dist.script))
}

gulp.task('scripts', scripts);
gulp.task('sass', sassFn);
gulp.task('html', html);
gulp.task('server', server);
gulp.task('styles', styles);

function server() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("./src/scss/*.scss", gulp.series('sass')).on('change', browserSync.reload);
    gulp.watch("./src/script/**/*.js", gulp.series('scripts')).on('change', browserSync.reload);
    gulp.watch("./src/*.html", gulp.series('html')).on('change', browserSync.reload);
    gulp.watch("./src/style/*.css", gulp.series('styles')).on('change', browserSync.reload);
}

gulp.task('default', gulp.parallel( styles, sassFn,scripts, html, server));