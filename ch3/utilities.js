/**
 * Created by bassem on 3/15/17.
 */

'use strict';

const urlParse = require('url').parse;
const urlResolve = require('url').resolve;
const slug = require('slug');
const path = require('path');
const cheerio = require('cheerio');

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

module.exports.getLinkUrl = (currentUrl, element) => {
  const link = urlResolve(currentUrl, element.attribs.href || '');
  const parsedLink = urlParse(link);
  const currentParsedUrl = urlParse(currentUrl);
  if (parsedLink.hostname !== currentParsedUrl.hostname || !parsedLink.pathname) {
    return null;
  }
  return link;
};

module.exports.getPageLinks = (currentUrl, body) =>
  [].slice.call(cheerio.load(body)('a'))
    .map(element => module.exports.getLinkUrl(currentUrl, element))
    .filter(element => !!element);

module.exports.promisify = callbackBasedApi => function (...args) {
  return new Promise((resolve, reject) => {
    args.push((err, result) => {
      if (err) return reject(err);
      if (arguments.length <= 2) return resolve(result);
      return resolve([].slice.call(args, 1));
    });

    callbackBasedApi(...args);
  });
};
