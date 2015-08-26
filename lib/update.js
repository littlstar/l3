'use strict';

/**
 * Module dependencies.
 * @private
 */

const manifest = require('./manifest');
const Batch = require('batch');
const sync = require('./sync');
const list = require('./list');
const fs = require('fs');

/**
 * Updates all files in index
 *
 * @public
 * @Function
 * @name update
 * @param {Object} opts - Update options.
 * @param {Function} done - Called whe complete..
 * @param {String} [opts.bucket = *] - Bucket pattern to update.
 * @param {String] [opts.file = *] - File pattern to update.
 */

module.exports = (opts, done) => {
  if (null != opts && 'object' != typeof opts)
    opts = {};

  // segfault occurs when making this an arrow function...
  function makeRegex (s) { return 'string' == typeof s ? RegExp(s) : /.*/; }
  const mimetypeRegex = makeRegex(opts.mimetype);
  const bucketRegex = makeRegex(opts.bucket);
  const fileRegex = makeRegex(opts.file);
  const jobs = new Batch();
  const idx = manifest.read();

  /**
   * Returns a function that checks
   * pattern prediates provided to
   * this function.
   *
   * @private
   * @function
   * @name prediates
   * @return {Function} o => {Boolean}
   */

  const predicates = _ => o => (
    bucketRegex.test(o.bucket) &&
    fileRegex.test(o.ifilename) &&
    mimetypeRegex.test(o.mimetype)
  );

  /**
   * Returns a function that logs info
   * for an item.
   *
   * @private
   * @function
   * @name log
   * @return {Function} o => o
   */

  const log = _ => o => {
    console.log("Updating `%s'...\n(%s => %s)\n",
                o.filename,
                new Date(o.timestamp * 1000),
                new Date(), o)
    return o;
  }

  list()
  // test predicates
  .filter(predicates())
  // log info
  .map(log())
  // queue up
  .forEach(o => jobs.push(next => sync({bucket: o.bucket, url: o.uri}, next)));

  // run!
  jobs.end(err => done(err));
};
