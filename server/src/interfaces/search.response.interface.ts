import { Sitter } from './sitter.interface';
import { Hotel } from './hotel.interface';

export interface SearchResponse {
  data: Sitter[] | Hotel[];
  size: number;
  paging: Page;
}

export interface Page {
  page: number;
  pageSize: number;
  maxPage: number;
}
