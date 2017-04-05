'use strict';

const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');
const async = require('async');

console.dir((new Date()).toTimeString());
spider(process.argv[2], 1, (err) => {
  if (err) {
    console.log(err);
    console.dir((new Date()).toTimeString());
    process.exit(1);
  } else {
    console.log('Download complete');
    console.dir((new Date()).toTimeString());
  }
});

function spider(url, nesting, callback) {
  const filename = utilities.urlToFilename(url);
  fs.readFile(filename, 'utf8', (err, body) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return callback(err);
      }

      return download(url, filename, (err, data) => {
        if (err) {
          return callback(err);
        }
        return spiderLinks(url, data, nesting, callback);
      });
    }

    return spiderLinks(url, body, nesting, callback);
  });
}


function spiderLinks(currentUrl, body, nesting, callback) {
  if (nesting === 0) {
    return process.nextTick(callback);
  }

  const links = utilities.getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return process.nextTick(callback);
  }

  return async.eachSeries(links, (link, cb) => {
    spider(link, nesting - 1, cb);
  }, callback);
}

function download(url, filename, callback) {
  console.log(`Downloading ${url}`);
  async.waterfall(
    [
      (cb) => {
        request(url, (err, response, resBody) => {
          if (err) {
            return cb(err);
          }
          return cb(null, resBody);
        });
      },
      (data, cb) => {
        mkdirp(path.dirname(filename), (err) => {
          if (err) {
            return callback(err);
          }
          return cb(null, data);
        });
      },
      (data, cb) =>
        fs.writeFile(filename, data, (err) => {
          if (err) {
            return cb(err);
          }
          return cb(null, data);
        })
    ],
    (err, body) => {
      if (err) {
        return callback(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      return callback(null, body);
    }
  );
}
