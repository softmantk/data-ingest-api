import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PropertyModule } from '../api/property/property.module';
import { S3LoaderService } from '../feeder/common/services/loaders/s3.loader.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URL') || 'mongodb://localhost:27028/buenrono',
      }),
      inject: [ConfigService],
    }),
    PropertyModule,
  ],
  providers: [S3LoaderService],
  exports: [MongooseModule, PropertyModule],
})
export class CoreModule {
}
