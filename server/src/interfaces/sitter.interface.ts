import { SitterSourceType } from '@/enums/sitter.source.type';

export interface Sitter {
  id?: string;
  externalId: string;
  fullName: string;
  location: string;
  price?: any;
  source: SitterSourceType;
}
