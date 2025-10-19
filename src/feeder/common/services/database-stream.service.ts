import { Injectable } from '@nestjs/common';
import { PropertyService } from '../../../api/property/property.service';
import { Writable } from 'node:stream';
import { AnyBulkWriteOperation } from 'mongoose';
import { Property } from '../../../api/property/property.schema';

@Injectable()
export class DatabaseStreamService {
  constructor(private propertyService: PropertyService) {}

  savePropertiesToDatabase(batchSize: number = 1500): Writable {
    const batches: Property[] = [];
    const buildWriteQueries = (currentBatch: Property[]) => {
      const writeQueries: AnyBulkWriteOperation[] = currentBatch.map(
        (item) => ({
          updateOne: {
            filter: {
              source: item.source,
              externalId: item.externalId,
            },
            update: item,
            upsert: true,
          },
        }),
      );
      return writeQueries;
    };

    const writeableDBStream = new Writable({
      objectMode: true,
      write: async (chunk, __, callback) => {
        batches.push(chunk);
        if (batches.length >= batchSize) {
          const bulkWriteQueries = buildWriteQueries(
            batches.splice(0, batchSize),
          );
          await this.propertyService.bulkWriteItems(bulkWriteQueries);
        }
        callback();
      },

      final: async (cb) => {
        if (batches.length) {
          const bulkWriteQueries = buildWriteQueries(
            batches.splice(0, batchSize),
          );
          await this.propertyService.bulkWriteItems(bulkWriteQueries);
        }
        cb();
      },
    });

    return writeableDBStream;
  }
}
