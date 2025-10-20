import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { AirbnbFeed } from './feeds/airbnb/airbnb.feed';
import { HousingAnywhereFeed } from './feeds/housing-anywhere/housing-anywhere.feed';
import { FeedRunnerService } from './feed-runner.service';

@Injectable()
export class FeedSchedulerRegistryService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private feedRunnerService: FeedRunnerService,
    private airbnbFeed: AirbnbFeed,
    private housingAnywhereFeed: HousingAnywhereFeed,
  ) {
  }

  registerFeeds() {
    const feeds = [
      this.airbnbFeed,
      this.housingAnywhereFeed,
    ];

    feeds.forEach(async (feed) => {
      const job = new CronJob(feed.scheduledAt, async () => {
        await this.feedRunnerService.composeStreamFeeds(feed);
      });
      await this.feedRunnerService.composeStreamFeeds(feed); // running everything on start up for debugging purpose

      this.schedulerRegistry.addCronJob(feed.name, job);
    });
    console.log('Initialised job registry');
  }
}
