/**
 * Created by bassem on 3/15/17.
 */

'use strict';

const urlParse = require('url').parse;
const path = require('path');

const slug = require('slug');

module.exports.urlToFilename = (url) => {
  const parsedUrl = urlParse(url);
  const urlPath = parsedUrl.path.split('/')
    .filter(component => component !== '')
    .map(component => slug(component, { remove: null }))
    .join('/');
  let filename = path.join(parsedUrl.hostname, urlPath);
  if (!path.extname(filename).match(/htm/)) {
    filename += '.html';
  }
  return filename;
};
