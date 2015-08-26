'use strict';

/**
 * Module dependencies.
 * @private
 */

const debug = require('debug')('l3:info');
const path = require('path');

/**
 * Our known l3 root directory.
 *
 * @public
 * @const
 * @name L3_ROOT
 * @type {String}
 */

const L3_ROOT = exports.L3_ROOT = (
  process.env.L3_ROOT ||
  path.resolve(process.env.HOME, '.l3')
);
debug("L3_ROOT='%s'", L3_ROOT);

/**
 * Our known l3 index.
 *
 * @public
 * @const
 * @name L3_INDEX
 * @type {String}
 */

const L3_INDEX = exports.L3_INDEX = (
  process.env.L3_INDEX ||
  path.resolve(L3_ROOT, 'index.json')
);
debug("L3_INDEX='%s'", L3_INDEX);

/**
 * Our known l3 http server port.
 *
 * @public
 * @const
 * @name L3_PORT
 * @type {Number}
 */

const L3_PORT = exports.L3_PORT = (
  process.env.L3_PORT || 3737
);
debug("L3_PORT='%s'", L3_PORT);
