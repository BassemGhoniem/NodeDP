/**
 * Created by bassem on 4/12/17.
 */

const RandomStream = require('./randomStream');

const randomStream = new RandomStream();
randomStream.on('readable', () => {
  let chunk;
  while ((chunk = randomStream.read()) !== null) {
    console.log(`Chunk received: ${chunk.toString()}`);
  }
});
