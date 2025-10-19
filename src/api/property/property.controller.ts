import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Property } from './property.schema';
import { type FindQueryOptions, PropertyService } from './property.service';
import { CreatePropertyDto } from './property.dto';
import { getNumberQuery } from '../api.utils';

@Controller('property')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get('/')
  async find(@Query() filter: FindQueryOptions<Property> = {}) {
    const findQueryOptions = this.parseFindFilter(filter);
    console.log(
      'find: findQueryOptions',
      JSON.stringify(findQueryOptions, null, 1),
    );

    const results = await this.propertyService.find(findQueryOptions);
    return results;
  }

  // @Post('/')
  // async create(@Body() property: CreatePropertyDto) {
  //   console.log('create: property', property);
  //
  //   const result = await this.propertyService.create(property);
  //   console.log('create: result', result);
  //   return result;
  // }

  private parseFindFilter(filters: FindQueryOptions<Property>) {
    if (filters?.title) {
      filters.title = { $regex: new RegExp(filters.title, 'i') };
    }
    if (filters?.['pricing.price']) {
      const priceFilter = getNumberQuery(filters['pricing.price']);
      filters['pricing.price'] = priceFilter;
    }
    /*
    TODO
    add as many filter modifications
    but for many advanced and efficient filters should use elastic search or opensearch solutions instead of mongodb
    * */
    return filters;
  }
}
