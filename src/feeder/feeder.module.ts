import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CoreModule } from '../core/core.module';
import { FeedRunnerService } from './feed-runner.service';
import { AirbnbFeed } from './feeds/airbnb/airbnb.feed';
import { S3LoaderService } from './common/services/loaders/s3.loader.service';
import { JsonProcessor } from './common/services/processors/json.processor';
import { DatabaseStreamService } from './common/services/database-stream.service';
import { HousingAnywhereFeed } from './feeds/housing-anywhere/housing-anywhere.feed';
import { FeedSchedulerRegistryService } from './feed-scheduler-registry.service';

@Module({
  imports: [CoreModule, ScheduleModule.forRoot()],
  providers: [
    S3LoaderService,
    FeedSchedulerRegistryService,
    FeedRunnerService,
    JsonProcessor,
    DatabaseStreamService,
    AirbnbFeed,
    HousingAnywhereFeed,
  ],
  exports: [FeedRunnerService],
})
export class FeederModule {}
