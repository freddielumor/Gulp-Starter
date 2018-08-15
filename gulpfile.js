/*******************************
    Require Packages
********************************/
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create();

/*******************************
    Define Source & Dist Paths
********************************/
const srcPath = 'src';
const distPath = 'dist';

const imageSrcPath = 'src/images';
const imageDistPath = 'dist/images';

const sassSrcPath = 'src/scss';
const cssSrcPath = 'src/css';
const cssDistPath = 'dist/css';

const jsSrcPath = 'src/js';
const jsDistPath = 'dist/js';

/*******************************
    Define Tasks
********************************/

// Compile SASS
gulp.task('sass', () =>
    gulp.src(`${sassSrcPath}/*.scss`)
        .pipe(concat('main.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssSrcPath))
        .pipe(browserSync.stream())
);

// Concatinate Js Then transpile to ES5
gulp.task('concatjs', () =>
    gulp.src(`${jsSrcPath}/*.js`)
        .pipe(babel())
        .pipe(gulp.dest(jsSrcPath))
);

// Watch Sass & Serve
gulp.task('serve', function () {
    browserSync.init({
        server: "./src"
    });
});

// Default Task - Start Server & Watch files for changes
gulp.task('default', ['serve'], function () {
    gulp.watch(`${srcPath}/*.html`).on('change', browserSync.reload);
    gulp.watch(`${sassSrcPath}/*.scss`, ['sass']);
    gulp.watch(`${jsSrcPath}/*.js`, ['concatjs']).on('change', browserSync.reload);
});

/*******************************
    Define Build Tasks
********************************/

// Copy All HTML files
gulp.task('buildHtml', () =>
    gulp.src(`${srcPath}/*.html`)
        .pipe(gulp.dest(distPath))
);

// Minify css, rename .min.css in production build
gulp.task('minifyCss', () => {
    gulp.src(`${cssSrcPath}/main.css`)
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(cssDistPath));
});

// Uglify & Concatinate Js Then transpile to ES5 & rename .min.js in production build
gulp.task('buildJs', () =>
    gulp.src(`${jsSrcPath}/*.js`)
        .pipe(concat('main.js'))
        .pipe(rename('main.min.js'))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(jsDistPath))
);

// Minify Images
gulp.task('imageMin', () =>
    gulp.src(`${imageSrcPath}/*`)
        .pipe(imagemin())
        .pipe(gulp.dest(imageDistPath))
);

// Build Task
gulp.task('build', ['buildHtml', 'imageMin', 'minifyCss', 'buildJs']);