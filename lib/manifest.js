'use strict';

/**
 * Module dependencies.
 * @private
 */

const mimetype = require('mimetype');
const rimraf = require('rimraf').sync;
const common = require('./common');
const path = require('path');
const fs = require('fs');

const L3_ROOT = common.L3_ROOT;
const L3_INDEX = common.L3_INDEX;

/**
 * Manifest states.
 */

const NONE = 0x00;
const OPEN = 0x01;
const OPENED = 0x02;
const FLUSH = 0x03;

/**
 * Current manifest state.
 * @private
 */

let state = NONE;

/**
 * In memory cursor object.
 *
 * @private
 * @type {Object}
 */

const cursor = Object.create(null);

/**
 * Extend manifest cursor object.
 *
 * @private
 * @function
 * @name extend
 * @param {Object} o - Extending object.
 */

const extend = o => {
  for (let k in o) {
    cursor.modified = Date()
    if (null == o[k]) delete cursor[k];
    else cursor[k] = o[k];
  }
};

const cycle = _ => {
  let idx = null;
  let json = {};
  switch (state) {
    case NONE:
      state = OPEN;
      cycle();
      break;

    case OPEN:
      state = OPENED;
      idx = fs.readFileSync(L3_INDEX);
      try { json = JSON.parse(String(idx)); }
      catch (e) {}
      extend(json);
      break;

    case OPENED:
      break;

    case FLUSH:
      break;
  }
};

/**
 * Black list of index keys
 * to ignore when traversing.
 *
 * @public
 * @type {Array}
 */

const KEY_BLACKLIST = exports.KEY_BLACKLIST = [
  'modified',
  'name',
];

/**
 * Stores a file in the l3 index.
 *
 * @public
 * @function
 * @name index
 * @param {String} file - Local file path
 * @param {String} source - Source URI
 */

const index = exports.index = (file, source) => {
  // ensure state
  cycle();
  const insert = {};
  insert[file] = {
    timestamp: (Date.now() / 1000) | 0,
    mimetype: mimetype.lookup(file),
    filename: path.basename(file),
    bucket: path.dirname(file),
    path: file,
    uri: source
  };
  extend(insert);
  state = FLUSH;
  return this;
};

/**
 * Saves manifest state.
 *
 * @public
 * @function
 * @name save
 */

const save = exports.save = _ => {
  if (state == FLUSH) {
    fs.writeFileSync(L3_INDEX, JSON.stringify(cursor, null, 2));
    state = OPEN;
  }
  return this;
};

/**
 * Reads and returns manifest index.
 *
 * @public
 * @function
 * @name read
 */

const read = exports.read = _ => {
  cycle();
  return cursor;
};

/**
 * Removes an item from the manifest.
 *
 * @public
 * @function
 * @name remove
 * @param {String} path
 */

const remove = exports.remove = file => {
  cycle();
  const item = cursor[file];
  if (item) {
    rimraf(path.resolve(L3_ROOT, item.path));
    save();
  }
}
