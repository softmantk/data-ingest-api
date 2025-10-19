import { NestFactory } from '@nestjs/core';
import { FeederModule } from './feeder/feeder.module';
import { FeedSchedulerRegistryService } from './feeder/feed-scheduler-registry.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(FeederModule);
  console.log('Job server started.');
  const feedRegistryService = app.get(FeedSchedulerRegistryService);
  feedRegistryService.registerFeeds();
}

bootstrap();
