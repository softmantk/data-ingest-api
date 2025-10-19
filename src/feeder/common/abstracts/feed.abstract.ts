import { Duplex, Readable } from 'node:stream';
import { TransformerFunctionType } from '../../feeds/types';
import { CronExpression } from '@nestjs/schedule';

export abstract class FeedAbstract {
  abstract name: string;

  abstract scheduledAt: CronExpression;

  abstract loader(): Promise<Readable>;

  abstract processor(): Duplex;

  abstract transformers(): TransformerFunctionType[];
}
