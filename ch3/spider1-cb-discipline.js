/**
 * Created by bassem on 4/3/17.
 */

const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');

/**
 * Applying callback discipline
 *  1- return as soon as possible
 *  2- create named functions keep them out of closures, pass intermediate values
 *  3- modularize the code, smaller, reusable functions whenever possible.
 */

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
    return saveFile(filename, body, (error) => {
      if (error) {
        return callback(error);
      }
      console.log(`Downloaded and saved: ${url}`);
      return callback(null, body);
    });
  });
}

function spider(url, callback) {
  const filename = utilities.urlToFilename(url);
  fs.exists(filename, (exists) => {
    if (exists) {
      return callback(null, filename, false);
    }
    return download(url, filename, (err) => {
      if (err) {
        return callback(err);
      }
      return callback(null, filename, true);
    });
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
