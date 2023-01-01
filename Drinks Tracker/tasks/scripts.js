const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const inject = require('gulp-inject-string');

function build() {
  console.log("BUILD");
  return src('app/**/*.js')
  // return src('app/**/*.*')
    .pipe(babel())
    .pipe(inject.replace('process.env.NODE_ENV', '"production"'))
    .pipe(dest('build'));
}

function developBuild() {
  return src('app/**/*.js')
  // return src('app/**/*.*')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(dest('build'));
}


function css() {
  return src('app/renderer/*.css')
    .pipe(dest('build/renderer/'))
}

build.displayName = 'build-scripts';
developBuild.displayName = 'dev-build-scripts';
css.displayName = 'move-css';

exports.build = build;
exports.developBuild = developBuild;
exports.css = css;
