import { SearchCategoryType } from '../../enums/search.category.type';
import { Page } from '../../interfaces/search.response.interface';
import { IsNotEmpty } from 'class-validator';

export class SearchRequestDto {
  @IsNotEmpty()
  public category: SearchCategoryType;

  public paging: Page;
}
