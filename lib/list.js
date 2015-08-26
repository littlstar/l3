'use strict';

/**
 * Module dependencies.
 * @private
 */

const manifest = require('./manifest');

/**
 * Returns an array of all items
 * in l3 store or by bucket.
 *
 * @public
 * @function
 * @name list
 * @param {Object} opts - List options.
 * @param {String} [opts.bucket] - Bucket pattern
 * @return {Array}
 */

module.exports = opts => {
  opts = opts || {};
  const bucket = opts.bucket ? RegExp(opts.bucket) :  /.*/;
  const idx = manifest.read();
  return (
    Object.keys(idx)
    // filter blacklisted keys
    .filter(k => -1 == manifest.KEY_BLACKLIST.indexOf(k))
    // convert to object
    .map(k => idx[k])
    // filter with bucket pattern
    .filter(f => bucket.test(f.bucket))
  );
};
