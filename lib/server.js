'use strict';

/**
 * Module dependencies.
 * @private
 */

const express = require('express');
const common = require('./common');
const serve = require('serve-static');
const http = require('http');
const path = require('path');
const list = require('./list');
const url = require('url');

const L3_ROOT = common.L3_ROOT;
const L3_PORT = common.L3_PORT;
const L3_INDEX = common.L3_INDEX;

/**
 * Handle index middleware.
 *
 * @public
 * @function
 * @name handleIndexes
 * @return {Function} (req, res) => ...
 */

const handleIndexes = _ => (req, res) => {
  const uri = url.parse(req.url);
  const obj = {};
  const bucket = uri.pathname.substr(1).replace(/\/$/, '');
  const items = list({bucket: bucket});
  items.forEach(i => obj[i.path] = i);
  res.send(obj);
}

/**
 * Starts a simple l3 HTTP server.
 *
 * @public
 * @function
 * @name server
 * @param {Object} opts - Server options.
 * @param {Function} done
 * @param {Number} [opts.port] - Server port.
 */

module.exports = (opts, done) => {
  const app = express();
  const port = opts.port || L3_PORT;
  const server = http.createServer(app);
  console.log("serving `%s'", L3_ROOT);
  app.get('/', (req, res) => res.redirect(path.basename(L3_INDEX)));
  app.use(serve(L3_ROOT));
  app.use(handleIndexes());
  server.listen(port, _ => console.log("listening on port %d", port));
};
