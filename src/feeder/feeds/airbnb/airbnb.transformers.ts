import { Property } from '../../../api/property/property.schema';

export type AirbnbPropertyType = {
  id: string;
  city: string;
  availability: boolean;
  priceSegment: string;
  pricePerNight: number;
};

export const toBuernoTransformer = (data: AirbnbPropertyType): Property => {
  return {
    source: 'airbnb',
    isAvailable: data.availability,
    externalId: data.id,
    pricing: {
      price: data.pricePerNight,
      pricingType: 'nightly',
    },
    location: {
      city: data.city,
    },
  };
};
