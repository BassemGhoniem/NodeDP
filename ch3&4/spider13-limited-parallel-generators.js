/**
 * Created by bassem on 4/10/17.
 */


const thunkify = require('thunkify');
const co = require('co');
const request = thunkify(require('request'));
const mkdirp = thunkify(require('mkdirp'));
const fs = require('fs');
const path = require('path');
const utilities = require('./utilities');
const TaskQueue = require('./taskQueue-generators');

const downloadQueue = new TaskQueue(2);
const readFile = thunkify(fs.readFile);
const writeFile = thunkify(fs.writeFile);
const nextTick = thunkify(process.nextTick);

function* download(url, filename) {
  console.log(`Downloading ${url}`);
  const response = yield request(url);
  const body = response[1];
  yield mkdirp(path.dirname(filename));
  yield writeFile(filename, body);
  console.log(`Downloaded and saved ${url}`);
  return body;
}

function* spider(url, nesting) {
  const filename = utilities.urlToFilename(url);
  let body;
  try {
    body = yield readFile(filename, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    body = yield download(url, filename);
  }
  yield spiderLinks(url, body, nesting);
}

function spiderLinks(currentUrl, body, nesting) {
  if (nesting === 0) {
    return nextTick();
  }

  return (callback) => {
    let completed = 0
    let hasErrors = false;
    const links = utilities.getPageLinks(currentUrl, body);
    if (links.length === 0) {
      return process.nextTick(callback);
    }
    function done(err) {
      if (err && !hasErrors) {
        hasErrors = true;
        return callback(err);
      }
      if (++completed === links.length && !hasErrors) {
        callback();
      }
    }
    links.forEach((link) => {
      downloadQueue.pushTask(function* run() {
        yield spider(link, nesting - 1);
        done();
      });
    });
  };
}

co(function* run() {
  try {
    yield spider(process.argv[2], 1);
    console.log('Download complete');
  } catch (err) {
    console.log(err);
  }
});
