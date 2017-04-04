'use strict';

const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');

spider(process.argv[2], 1, (err) => {
  if (err) {
    console.log(err);
    process.exit();
  } else {
    console.log('Download complete');
  }
});

function spider(url, nesting, callback) {
  const filename = utilities.urlToFilename(url);
  fs.readFile(filename, 'utf8', (err, body) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return callback(err);
      }

      return download(url, filename, (err, body) => {
        if (err) {
          return callback(err);
        }
        return spiderLinks(url, body, nesting, callback);
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
  return iterateSeries(links, nesting, spider, callback);
}

function iterateSeries(collection, iteratorCBParam, iteratorCallback, finalCallback) {
  function iterate(index) {
    if (index === collection.length) {
      return finalCallback();
    }
    return iteratorCallback(collection[index], iteratorCBParam - 1, (err) => {
      if (err) {
        return finalCallback(err);
      }
      return iterate(index + 1);
    });
  }

  return iterate(0);
}

function saveFile(filename, contents, callback) {
  mkdirp(path.dirname(filename), (err) => {
    if (err) {
      return callback(err);
    }
    return fs.writeFile(filename, contents, callback);
  });
}

function download(url, filename, callback) {
  console.log(`Downloading ${url}`);
  request(url, (err, response, body) => {
    if (err) {
      return callback(err);
    }
    return saveFile(filename, body, (err) => {
      if (err) {
        return callback(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      return callback(null, body);
    });
  });
}
