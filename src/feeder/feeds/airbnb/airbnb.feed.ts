import { Injectable } from '@nestjs/common';
import { Duplex, PassThrough, Readable } from 'node:stream';
import { S3LoaderService } from '../../common/services/loaders/s3.loader.service';
import { JsonProcessor } from '../../common/services/processors/json.processor';
import { FeedAbstract } from '../../common/abstracts/feed.abstract';
import { toBuernoTransformer } from './airbnb.transformers';
import { CronExpression } from '@nestjs/schedule';

@Injectable()
export class AirbnbFeed implements FeedAbstract {
  name = 'airbnb';

  scheduledAt: CronExpression = CronExpression.EVERY_HOUR;

  constructor(
    private s3LoaderService: S3LoaderService,
    private jsonProcessor: JsonProcessor,
  ) {}

  async loader(): Promise<Readable> {
    const s3Stream = await this.s3LoaderService.load(
      // 'buenro-tech-assessment-materials', 'structured_generated_data.json',
      // https://buenro-tech-assessment-materials.s3.eu-north-1.amazonaws.com/large_generated_data.json
      'buenro-tech-assessment-materials',
      'large_generated_data.json',
    );
    return s3Stream;
    // const arr = Array.from({ length: 1000 }, (_,i)=>({a:i+1}));
    // return Readable.from(arr);
  }

  processor(): Duplex {
    // return new PassThrough({ objectMode: true });
    const JSONStream = this.jsonProcessor.process();
    return JSONStream;
  }

  transformers() {
    return [toBuernoTransformer];
  }
}
