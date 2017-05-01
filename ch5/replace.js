/**
 * Created by bassem on 4/15/17.
 */

const ReplaceStream = require('./replaceStream');

process.stdin
  .pipe(new ReplaceStream(process.argv[2], process.argv[3]))
  .pipe(process.stdout);
