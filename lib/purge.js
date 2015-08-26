'use strict';

/**
 * Module dependencies.
 * @private
 */

const manifest = require('./manifest');
const common = require('./common');
const rimraf = require('rimraf').sync;
const path = require('path');

const L3_ROOT = common.L3_ROOT;

/**
 * Purge l3 store or by bucket pattern
 *
 * @public
 * @function
 * @name purge
 * @param {Object} opts - Purge options.
 * @param {Function} done
 */

module.exports = (opts, done) => {
  const bucketRegex = opts.bucketRegex || /.*/;
  const idx = manifest.read();
  // travserse keys
  Object.keys(idx)
  // filter blacklisted keys
  .filter(k => -1 == manifest.KEY_BLACKLIST.indexOf(k))
  // get object
  .map(k => idx[k])
  // filter
  .filter(f => f.bucket.match(bucketRegex))
  // rmrf!
  .forEach(f => manifest.remove(f.path));

  if (/.*/.source == (bucketRegex.source || bucketRegex)) {
    rimraf(L3_ROOT);
  }
};

