import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyModule } from '../api/property/property.module';
import { S3LoaderService } from '../feeder/common/services/loaders/s3.loader.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/buenro'), //todo move to env
    PropertyModule,
  ],
  providers: [S3LoaderService],
  exports: [MongooseModule, PropertyModule],
})
export class CoreModule {}
