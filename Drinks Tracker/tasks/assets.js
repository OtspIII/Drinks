const { src, dest } = require('gulp');

function copyHtml() {
  // console.log("HTML>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  return src('app/renderer/index.html').pipe(dest('build/renderer'));
}

copyHtml.displayName = 'copy-html';

exports.copyHtml = copyHtml;
