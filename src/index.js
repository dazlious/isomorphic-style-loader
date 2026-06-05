/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

module.exports = function loader() {}
module.exports.pitch = function pitch(request) {
  if (this.cacheable) {
    this.cacheable()
  }

  // Requires webpack >= 5
  const stringifyRequest = (req) => JSON.stringify(this.utils.contextify(this.context, req))
  const insertCss = require.resolve('./insertCss.js')
  let { getCss } = this.getOptions()
  getCss = typeof getCss === 'function' ? getCss : (css) => css
  return `
    var getCss = ${getCss.toString()};
    var css = getCss(require(${stringifyRequest(`!!${request}`)}));
    var insertCss = require(${stringifyRequest(`!${insertCss}`)});
    var content = typeof css === 'string' ? [[module.id, css, '']] : css;

    exports = module.exports = css.locals || {};
    exports._getContent = function() { return content; };
    exports._getCss = function() { return '' + css; };
    exports._insertCss = function(options) { return insertCss(content, options) };

    ${
      this.hot
        ? `
    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (module.hot && typeof window !== 'undefined' && window.document) {
      var removeCss = function() {};
      module.hot.accept(${stringifyRequest(`!!${request}`)}, function() {
        css = getCss(require(${stringifyRequest(`!!${request}`)}));
        content = typeof css === 'string' ? [[module.id, css, '']] : css;
        removeCss = insertCss(content, { replace: true });
      });
      module.hot.dispose(function() { removeCss(); });
    }
  `
        : ''
    }
  `
}
