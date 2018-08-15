/*******************************
    Require Packages
********************************/
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

/*******************************
    Define Source & Dist Paths
********************************/
const srcPath = 'src';
const distPath = 'dist';

const imageSrcPath = 'src/images';
const sassSrcPath = 'src/scss';
const jsSrcPath = 'src/js';

const imagePath = 'dist/images';
const cssPath = 'dist/css';
const jsPath = 'dist/js';

/*******************************
    Define Tasks
********************************/

// Copy All HTML files
gulp.task('copyHtml', () =>
    gulp.src(`${srcPath}/*.html`)
        .pipe(gulp.dest(distPath))
);

// Minify Images
gulp.task('imageMin', () =>
    gulp.src(`${imageSrcPath}/*`)
        .pipe(imagemin())
        .pipe(gulp.dest(imagePath))
);

// Compile SASS
gulp.task('sass', () =>
    gulp.src(`${sassSrcPath}/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssPath))
);

// Uglify & Concatinate Js Then transpile to ES5
gulp.task('concat', () =>
    gulp.src(`${jsSrcPath}/*.js`)
        .pipe(concat('main.js'))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(jsPath))
);

// Default Task
gulp.task('default', ['copyHtml', 'imageMin', 'sass', 'concat']);

// Watch files for changes
gulp.task('watch', function () {
    gulp.watch(`${srcPath}/*.html`, ['copyHtml']);
    gulp.watch(`${imageSrcPath}/*`, ['imageMin']);
    gulp.watch(`${imageSrcPath}/*.scss`, ['sass']);
    gulp.watch(`${jsSrcPath}/*.js`, ['concat']);
});