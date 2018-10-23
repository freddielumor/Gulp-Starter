/*******************************
    Require Packages
********************************/
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

/*******************************
    Define Source & Dist Paths
********************************/
const srcPath = 'src';
const distPath = 'dist';

const imageSrcPath = 'src/images';
const imageDistPath = 'dist/images';

const fontSrcPath = 'src/font';
const fontDistPath = 'dist/font';

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
    gulp.src(`${sassSrcPath}/main.scss`)
        .pipe(concat('main.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssSrcPath))
        .pipe(browserSync.stream())
);

// JS Task
gulp.task('js', () =>
    gulp.src(`${jsSrcPath}/main.js`)
        .pipe(gulp.dest(jsSrcPath))
);

// Browsersync server
gulp.task('serve', function () {
    browserSync.init({
        server: "./src"
    });
});

// Default Task - Start Server & Watch files for changes
gulp.task('default', ['serve'], function () {
    gulp.watch(`${srcPath}/*.html`).on('change', browserSync.reload);
    gulp.watch(`${sassSrcPath}/main.scss`, ['sass']);
    gulp.watch(`${jsSrcPath}/main.js`, ['js']).on('change', browserSync.reload);
});

/*******************************
    Define Build Tasks
********************************/

// Copy All HTML files
gulp.task('buildHtml', () =>
    gulp.src(`${srcPath}/*.html`)
        .pipe(gulp.dest(distPath))
);

// Minify css
gulp.task('minifyCss', () => {
    gulp.src(`${cssSrcPath}/main.css`)
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(cssDistPath))
});

// Uglify & Concatinate Js Then transpile to ES5
gulp.task('buildJs', () =>
    gulp.src(`${jsSrcPath}/main.js`)
        .pipe(concat('main.js'))
        .pipe(babel())
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(gulp.dest(jsDistPath))
);

// Minify Images
gulp.task('imageMin', () =>
    gulp.src(`${imageSrcPath}/*`)
        .pipe(imagemin())
        .pipe(gulp.dest(imageDistPath))
);

// Copy Fonts
gulp.task('buildFont', () =>
    gulp.src(`${fontSrcPath}/*`)
        .pipe(gulp.dest(fontDistPath))
);

// Build Task
gulp.task('build', ['buildHtml', 'minifyCss', 'buildJs', 'imageMin', 'buildFont']);
