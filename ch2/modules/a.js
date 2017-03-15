/**
 * Created by bassem on 3/13/17.
 */

exports.loaded = false;
const b = require('./b');
module.exports = {
  bWasLoaded: b.loaded,
  loaded: true
};
delete require.cache[require.resolve('./a')];
