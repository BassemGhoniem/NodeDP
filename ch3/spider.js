/**
 * Created by bassem on 3/15/17.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const request = require('request');
const mkdirp = require('mkdirp');

const utilities = require('./utilities');

function saveFile(filename, body, cb) {
  mkdirp(path.dirname(filename), (err) => {    // [3]
    if (err) {
      return cb(err);
    }
    return fs.writeFile(filename, body, (error) => { // [4]
      if (error) {
        return cb(error);
      }
      return cb(null, filename, true);
    });
  });
}

function download(url, filename, cb) {
  console.log(`Downloading ${url}`);
  request(url, (err, response, body) => {      // [2]
    if (err) {
      return cb(err);
    }
    return saveFile(filename, body, cb);
  });
}
function spider(url, cb) {
  const filename = utilities.urlToFilename(url);
  fs.exists(filename, (exists) => {        // [1]
    if (exists) {
      return cb(null, filename, false);
    }
    return download(url, filename, cb);
  });
}

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console.log(err);
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already downloaded`);
  }
});
