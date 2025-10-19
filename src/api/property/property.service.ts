import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from './property.schema';
import {
  AnyBulkWriteOperation,
  FilterQuery,
  Model,
  MongooseBulkWriteResult,
} from 'mongoose';
import { safeJSONParse } from '../api.utils';

export interface PaginatedResult<TDocument> {
  data: TDocument[];
  total: number;
}

export type FindQueryOptions<TDocument> = FilterQuery<TDocument> & {
  $limit?: number;
  $skip?: number;
  $project?: Record<string, 1 | 0>;
  $sort?: Record<string, 1 | -1>;
};

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private PropertyModel: Model<Property>,
  ) {}

  async find(
    options: FindQueryOptions<Property>,
  ): Promise<PaginatedResult<Property>> {
    const { $limit = 20, $skip = 0, $sort, ...filter } = { ...options };
    const parsedFilter = this.parseFilter(filter);
    console.log('property.service.find: parsedFilter', parsedFilter);
    const query = this.PropertyModel.find(
      parsedFilter,
      {},
      {
        limit: $limit,
        skip: $skip,
        sort: $sort,
      },
    );
    const [data, total] = await Promise.all([
      query.exec(),
      this.countDocuments(parsedFilter),
    ]);
    return { data, total };
  }

  async create(document: Partial<Property>): Promise<Property> {
    return this.PropertyModel.create(document);
  }

  async countDocuments(filterQuery: FilterQuery<Property>): Promise<number> {
    return this.PropertyModel.countDocuments(filterQuery).exec();
  }

  async bulkWriteItems(
    items: AnyBulkWriteOperation[],
  ): Promise<MongooseBulkWriteResult> {
    return this.PropertyModel.bulkWrite(items);
  }

  private parseFilter = (filter: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(filter).map(([key, value]) => {
        const safeJSON = safeJSONParse(value);
        return [key, safeJSON];
      }),
    );
  };
}
