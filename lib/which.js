'use strict';

/**
 * Module dependencies.
 * @private
 */

const common = require('./common');
const path = require('path');
const fs = require('fs');

/**
 * Returns an absolute path to a file
 *
 * @public
 * @function
 * @name which
 * @param {Object} opts - Which options.
 * @param {String} opts.file - Which file to locatee.
 * @return {String}
 */

module.exports = opts => {
  if (opts && 'string' != typeof opts.file)
    throw new TypeError("Expecting file path to be defined.");

  const file = path.resolve(common.L3_ROOT, opts.file);
  try {
    fs.statSync(file);
    return file;
  } catch (e) {
    return null;
  }
};
