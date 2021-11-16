import { SitterSourceType } from '@/enums/sitter.source.type';
import {SearchCategoryType} from "../enums/search.category.type";
import {PetType} from "../enums/pet.type";
import {Geo} from "./geo.interface";

export interface Sitter {
  id?: string;
  externalId: string;
  source: SitterSourceType;
  name: string;
  address: string;
  location: string;
  geo: Geo;
  avatar: string;
  prices?: Price[];
  rating?: number;
  reviewsCount?: number;
}

export interface Price {
  category: SearchCategoryType;
  petType: PetType[];
  from: number;
  currency: string;
}
