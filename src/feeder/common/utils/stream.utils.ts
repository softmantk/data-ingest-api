import { Transform, Writable } from 'node:stream';
import { TransformerFunctionType } from '../../feeds/types';
import { clearInterval } from 'node:timers';
import { getSystemUsage } from './common.utils';
import { FeedAbstract } from '../abstracts/feed.abstract';

export const transformStream = (transformers: TransformerFunctionType[]) => {
  const transformFn = new Transform({
    objectMode: true,
    transform: (chunk, __, callback) => {
      try {
        // console.log('transform: chunk', chunk);

        let result = chunk;
        for (const fn of transformers) {
          result = fn(result);
          if (!result) {
            return callback();
          }
        }
        callback(null, result);
      } catch (error) {
        callback(error);
      }
    },
  });
  return transformFn;
};

export const debugStream = new Transform({
  objectMode: true,
  transform: (chunk, _, cb) => {
    console.log('DEBUG: chunk:', JSON.stringify(chunk).substring(0, 200));
    cb(null, chunk);
  },
});

debugStream.on('end', () => {
  console.log('Stream ended');
});

export const createLimitStream = (limit: number) => {
  let counter = 0;
  return new Transform({
    objectMode: true,
    transform(chunk, enc, cb) {
      if (counter >= limit) {
        this.push(null);
      } else {
        cb(null, chunk);
      }
      counter++;
      // console.log('createLimitStream: counter', JSON.stringify({ counter, chunk }));
    },
  });
};

export const counterStream = (feed: FeedAbstract, downStream: Writable) => {
  let counter = 0;
  let logInt;
  const startTime = new Date();
  logInt = setInterval(
    () =>
      console.log(
        `feed #${feed.name} processed ${counter} items so far: ${getSystemUsage(startTime)}`,
      ),
    3000,
  );
  const transform = new Transform({
    objectMode: true,
    transform: (chunk, __, callback) => {
      counter++;
      callback(null, chunk);
    },
    flush(callback) {
      callback();
      downStream.once('finish', () => {
        clearInterval(logInt);
        console.log(`feed #${feed.name} processed ${counter} items`);
      });
    },
  });
  return transform;
};

export const getTempWritableStream = () =>
  new Writable({
    objectMode: true,
    write: async (chunk, __, cb) => {
      await new Promise((res) => setTimeout(res, 100));
      console.log('write: chunk', chunk);
      cb();
    },
  });

export const delayStream = (delay = 1000) => {
  const delayPromise = () =>
    new Promise((resolve) => setTimeout(resolve, delay));
  return new Transform({
    objectMode: true,
    transform: async (chunk, encoding, callback) => {
      await delayPromise();
      callback(null, chunk);
    },
  });
};
