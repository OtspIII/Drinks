const { task, series } = require('gulp');
const rimraf = require('rimraf');
const gulp = require('gulp');

const scripts = require('./tasks/scripts');
const assets = require('./tasks/assets');
const watch = require('./tasks/watch');
const dist = require('./tasks/distribution');

// task('hello', function() {
//   console.log('Hello Beep');
// });
task('clean', function (done) {
  rimraf('./build', done);
});
// task('files', function() {
//   return gulp.src('app/renderer/db/**')
//     .pipe(gulp.dest('build/renderer/db/'))
// })
task('modules', function() {
  return gulp.src('app/renderer/modules/**')
    .pipe(gulp.dest('build/renderer/modules/'))
})
task('icon', function() {
  return gulp.src('app/main/mapIcon.png')
    .pipe(gulp.dest('build/main/'))
})
// task('images', function() {
//   return gulp.src('app/renderer/img/**')
//     .pipe(gulp.dest('build/renderer/img/'))
// })
task('modulesave', function() {
  return gulp.src('build/renderer/modules/**')
    .pipe(gulp.dest('app/renderer/modules/'))
})
// task('dbsave', function() {
//   return gulp.src('build/renderer/db/**')
//     .pipe(gulp.dest('app/renderer/db/'))
// })
// task('imgsave', function() {
//   return gulp.src('build/renderer/img/**')
//     .pipe(gulp.dest('app/renderer/img/'))
// })

task('build', series('modulesave','clean', assets.copyHtml, scripts.css,'modules','icon',scripts.build));
task('sync', series('modulesave'));



task('develop', series('modulesave','clean',scripts.css,'modules','icon', watch.start));
task('pack-win', series('build', dist.packWin));
task('pack-linux', series('build', dist.packLinux));
task('pack-mac', series('build', dist.packMac));




// let hi = require('hello');