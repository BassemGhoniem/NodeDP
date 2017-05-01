/**
 * Created by bassem on 4/12/17.
 */

'use strict';

const fs = require('fs');
const zlib = require('zlib');
const http = require('http');
const path = require('path');
const crypto = require('crypto');

const file = process.argv[2];
const server = process.argv[3];

const options = {
  hostname: server,
  port: 3000,
  path: '/',
  method: 'PUT',
  headers: {
    filename: path.basename(file),
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip'
  }
};

const req = http.request(options, res => console.log(`Server response: ${res.statusCode}`));

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(crypto.createCipher('aes192', 'a_shared_secret'))
  .pipe(req)
  .on('finish', () => console.log('File successfully sent'))
  .on('error', err => console.error(err));
