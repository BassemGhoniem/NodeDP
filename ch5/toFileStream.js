/**
 * Created by bassem on 4/12/17.
 */

const stream = require('stream');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class ToFileStream extends stream.Writable {
  constructor() {
    super({ objectMode: true });
  }

  _write(chunk, encoding, callback) {
    mkdirp(path.dirname(chunk.path), (err) => {
      if (err) {
        return callback(err);
      }
      return fs.writeFile(chunk.path, chunk.content, callback);
    });
  }
}
module.exports = ToFileStream;
