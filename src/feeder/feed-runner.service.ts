import {
  counterStream,
  createLimitStream,
  transformStream,
} from './common/utils/stream.utils';
import { FeedAbstract } from './common/abstracts/feed.abstract';
import { Injectable } from '@nestjs/common';
import { DatabaseStreamService } from './common/services/database-stream.service';
import { pipeline } from 'node:stream/promises';

@Injectable()
export class FeedRunnerService {
  constructor(private databaseStreamService: DatabaseStreamService) {}

  async composeStreamFeeds(feed: FeedAbstract) {
    console.log(`started processing #${feed.name} feed`);
    const feedStream = await feed.loader();
    // const writeStream = getTempWritableStream();
    const writeStream = this.databaseStreamService.savePropertiesToDatabase();

    await pipeline(
      feedStream,
      feed.processor(),
      // createLimitStream(1),
      // debugStream,
      transformStream(feed.transformers()),
      counterStream(feed, writeStream),
      writeStream,
    );
  }
}
