'use strict';

const fs = require('fs');

const utilities = require('./utilities');
const request = utilities.promisify(require('request'));
const mkdirp = utilities.promisify(require('mkdirp'));

const readFile = utilities.promisify(fs.readFile);
const writeFile = utilities.promisify(fs.writeFile);
const path = require('path');

console.dir((new Date()).toTimeString());

spider(process.argv[2], 1)
  .then(() => {
    console.log('Download complete');
    console.dir((new Date()).toTimeString());
  })
  .catch(err => console.log(err));

function spider(url, nesting) {
  const filename = utilities.urlToFilename(url);
  return readFile(filename, 'utf8')
    .then(
      body => spiderLinks(url, body, nesting),
      (err) => {
        if (err.code !== 'ENOENT') {
          throw err;
        }

        return download(url, filename)
          .then(body => spiderLinks(url, body, nesting))
          .catch(err => console.error(err));
      }
    );
}

function spiderLinks(currentUrl, body, nesting) {
  if (nesting === 0) {
    return Promise.resolve();
  }
  const links = utilities.getPageLinks(currentUrl, body);
  const promises = links.map(link => spider(link, nesting - 1));
  return Promise.all(promises);
}


function download(url, filename) {
  console.log(`Downloading ${url}`);
  let body;
  return request(url)
    .then((response) => {
      body = response.body;
      return mkdirp(path.dirname(filename));
    })
    .then(() => writeFile(filename, body))
    .then(() => {
      console.log(`Downloaded and saved: ${url}`);
      return body;
    })
    .catch(err => console.error(err));
}
