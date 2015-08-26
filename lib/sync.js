'use strict';

/**
 * Module dependencies.
 * @private
 */

const manifest = require('./manifest');
const through = require('through');
const common = require('./common');
const mkdirp = require('mkdirp').sync;
const rimraf = require('rimraf').sync;
const fetch = require('get-uri');
const debug = require('debug')('l3:sync');
const path = require('path');
const fs = require('fs');

const L3_ROOT = common.L3_ROOT;
const L3_INDEX = common.L3_INDEX;

/**
 * Syncs a file into a given bucket.
 *
 * @public
 * @function
 * @name sync
 * @param {Object} opts - Sync options.
 * @param {Function} done - Called when complete.
 * @param {Object} opts.bucket - Bucket path.
 * @param {String} opts.url - URL to sync.
 */

module.exports = (opts, done) => {
  if ('object' != typeof opts)
    throw new TypeError("sync expects an object of options as an argument.");

  let writer = null;
  let bucket = opts.bucket || '';

  const url = opts.url;
  const sink = through(chunk => chunk && this.push(chunk));
  const name = opts.name || path.basename(url);
  const file = [bucket, name].join('/');
  const dest = path.resolve(L3_ROOT, file);

  if ('string' != typeof bucket)
    throw new TypeError("Expecting bucket to be defined.");

  if ('string' != typeof url)
    throw new TypeError("Expecting url to be defined.");

  // ensure bucket exists
  bucket = path.resolve(L3_ROOT, bucket);
  debug("Syncing to bucket %s", bucket);
  mkdirp(bucket);

  // create stream writer,
  debug("Syncing to destination %s", dest);
  writer = fs.createWriteStream(dest, {flags: 'w+'});

  sink.on('data', chunk => debug("Sync chunk", chunk));

  // connect pipeline
  sink.pipe(writer)
  // handle errors and remove created file on failure
  .on('error', _ => rimraf(dest))
  .on('error', e => done(e))
  // store in index
  .on('close', _ => manifest.index(file, url).save())
  .on('close', _ => debug("Sync complete"))
  .on('close', _ => done());

  // get thee stuffff
  debug("Fetching %s", url);
  fetch(url, (err, rs) => err ? done(err) : rs.pipe(sink));
};
