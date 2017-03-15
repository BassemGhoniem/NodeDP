/**
 * Created by bassem on 3/13/17.
 */


exports.loaded = false;
const a = require('./a');
module.exports = {
  aWasLoaded: a.loaded,
  loaded: true
};
//delete require.cache[require.resolve('./b')];
