const { parallel, series, watch } = require('gulp');
const electron = require('./electron');
const hotreload = require('./hotreload');
const assets = require('./assets');
const scripts = require('./scripts');

function watchMainScripts() {
  return watch(['app/main/**/*.js'], series(scripts.developBuild, electron.stop, electron.start));
}

function watchRendererScripts() {
  return watch(['app/renderer/**/*.js'], series(scripts.developBuild, hotreload.reload));
}

function watchStyle() {
  return watch(['app/renderer/**/*.css'], series(hotreload.cssReload));
}

function watchHtml() {
  return watch(
    ['app/renderer/index.html'],
    series(assets.copyHtml, hotreload.inject, hotreload.reload),
  );
}

watchMainScripts.displayName = 'watch-main-scripts';
watchRendererScripts.displayName = 'watch-renderer-scripts';
watchHtml.displayName = 'watch-html';
watchStyle.displayName = 'watch-style';

exports.start = series(
  assets.copyHtml,
  scripts.developBuild,
  hotreload.start,
  electron.start,
  parallel(watchMainScripts, watchRendererScripts, watchHtml,watchStyle),
);
