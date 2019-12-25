/*******************************
    Require Packages
********************************/
const gulp = require("gulp");
const { series } = require("gulp");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();

/*******************************
    Define Source & Dist Paths
********************************/
const srcPath = "src";
const distPath = "dist";

const imageSrcPath = "src/images";
const imageDistPath = "dist/images";

const fontSrcPath = "src/font";
const fontDistPath = "dist/font";

const sassSrcPath = "src/scss";
const cssSrcPath = "src/css";
const cssDistPath = "dist/css";

const jsSrcPath = "src/js";
const jsDistPath = "dist/js";

/*******************************
    Define Tasks
********************************/

// Compile SASS
function style() {
  return gulp
    .src(`${sassSrcPath}/**/*.scss`)
    .pipe(concat("main.scss"))
    .pipe(sass())
    .pipe(gulp.dest(cssSrcPath))
    .pipe(browserSync.stream());
}

// Start Server & Watch files for changes
function watch() {
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
  gulp.watch(`${srcPath}/*.html`).on("change", browserSync.reload);
  gulp.watch(`${sassSrcPath}/**/*.scss`, style);
  gulp.watch(`${jsSrcPath}/**/*.js`).on("change", browserSync.reload);
}

exports.style = style;
exports.watch = watch;

/*******************************
    Define Build Tasks
********************************/

// Copy All HTML files
function buildHtml() {
  return gulp.src(`${srcPath}/*.html`).pipe(gulp.dest(distPath));
}

// Minify css
function minifyCss() {
  return gulp
    .src(`${cssSrcPath}/main.css`)
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(cssDistPath));
}

// Uglify & Concatinate Js
function buildJs() {
  return gulp
    .src(`${jsSrcPath}/main.js`)
    .pipe(concat("main.js"))
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(
      uglify().on("error", function(e) {
        console.log(e);
      })
    )
    .pipe(gulp.dest(jsDistPath));
}

// Minify Images
function imageMin() {
  return gulp
    .src(`${imageSrcPath}/*`)
    .pipe(imagemin())
    .pipe(gulp.dest(imageDistPath));
}

// Copy Fonts
function buildFont() {
  return gulp.src(`${fontSrcPath}/*`).pipe(gulp.dest(fontDistPath));
}

exports.buildHtml = buildHtml;
exports.minifyCss = minifyCss;
exports.buildJs = buildJs;
exports.imageMin = imageMin;
exports.buildFont = buildFont;
// Build Task
exports.build = series(buildHtml, minifyCss, buildJs, imageMin, buildFont);
