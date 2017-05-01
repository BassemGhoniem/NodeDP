/**
 * Created by bassem on 4/11/17.
 */

'use strict';

const request = require('request');

function getPageHtml(url) {
  return new Promise((resolve) => {
    request(url, (error, response, body) => {
      resolve(body);
    });
  });
}

async function main() {
  const html = await getPageHtml('http://google.com');
  console.log(html);
}

main();

console.log('Loading...');
