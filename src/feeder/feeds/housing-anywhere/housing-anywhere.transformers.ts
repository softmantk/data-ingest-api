import { Property } from '../../../api/property/property.schema';

export type HousingAnywhereApartmentType = {
  id: string;
  name: string;
  address: {
    country: string;
    city: string;
  };
  isAvailable: boolean;
  priceForNight: number;
};

export const toBuernoTransformer = (
  data: HousingAnywhereApartmentType,
): Property => {
  return {
    source: 'housing-anywhere',
    title: 'Lakeview House',
    isAvailable: data.isAvailable,
    externalId: data.id.toString(),
    pricing: {
      pricingType: 'nightly',
      price: data.priceForNight,
    },
    location: {
      city: data.address.city,
      country: data.address.country,
    },
  };
};
