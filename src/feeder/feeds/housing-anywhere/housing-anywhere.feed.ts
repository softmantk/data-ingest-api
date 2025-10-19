import { Injectable } from '@nestjs/common';
import { Duplex, PassThrough, Readable } from 'node:stream';
import { CronExpression } from '@nestjs/schedule';
import { S3LoaderService } from '../../common/services/loaders/s3.loader.service';
import { JsonProcessor } from '../../common/services/processors/json.processor';
import { FeedAbstract } from '../../common/abstracts/feed.abstract';
import { toBuernoTransformer } from './housing-anywhere.transformers';

@Injectable()
export class HousingAnywhereFeed implements FeedAbstract {
  name = 'housing-anywhere';

  constructor(
    private s3LoaderService: S3LoaderService,
    private jsonProcessor: JsonProcessor,
  ) {}

  scheduledAt: CronExpression = CronExpression.EVERY_10_MINUTES;

  async loader(): Promise<Readable> {
    const s3Stream = await this.s3LoaderService.load(
      // https://buenro-tech-assessment-materials.s3.eu-north-1.amazonaws.com/structured_generated_data.json
      'buenro-tech-assessment-materials',
      'structured_generated_data.json',
    );
    return s3Stream;
  }

  processor(): Duplex {
    const JSONStream = this.jsonProcessor.process();
    return JSONStream;
  }

  transformers() {
    return [toBuernoTransformer];
  }
}
