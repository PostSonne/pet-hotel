import { Geo } from './geo.interface';

export interface Hotel {
  _id: string;
  name: string;
  fullAddress: string;
  geo: Geo;
  link: string;
  icon: string;
  description?: string;
  phone?: string;
  email?: string;
  externalId?: string;
  rating?: number;
  reviewsCount?: number;
}
