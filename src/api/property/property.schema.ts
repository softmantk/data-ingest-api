import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Location {
  @Prop()
  street?: string;

  @Prop()
  houseNumber?: string;

  @Prop()
  city?: string;

  @Prop()
  cityEn?: string;

  @Prop()
  state?: string;

  @Prop()
  postalCode?: string;

  @Prop()
  country?: string;
}

@Schema({ _id: false })
export class Pricing {
  @Prop({ default: 'EUR' })
  currency?: string;

  @Prop({ enum: ['nightly', 'daily'] })
  pricingType?: 'nightly' | 'daily';

  @Prop()
  price?: number;
}

@Schema({ versionKey: false, timestamps: true })
export class Property {
  @Prop()
  title?: string;

  @Prop()
  code?: string;

  @Prop()
  source?: string;

  @Prop()
  externalId?: string; // property code

  @Prop(Location)
  location?: Location;

  @Prop()
  isAvailable?: boolean;

  @Prop()
  pricePerNight?: number;

  @Prop({ default: false })
  isPublished?: boolean;

  @Prop()
  transformer1?: string;
  @Prop()
  transformer2?: string;

  @Prop()
  pricing?: Pricing;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

//todo For efficient searching capabilities, should use text search engines such as elastic search or Mongodb atlas solutions
PropertySchema.index({ 'location.country': 1 });
PropertySchema.index({ title: 1 });
PropertySchema.index({ externalId: 1 });
PropertySchema.index({ 'location.city': 1 });
PropertySchema.index({ 'pricing.price': 1 });
