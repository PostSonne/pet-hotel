import { SearchRequestDto } from '../dtos/rq/search.request.dto';
import { SearchCategoryType } from '../enums/search.category.type';
import NodeCache from 'node-cache';
import SitterService from './sitter.service';
import HotelService from './hotel.service';

const cache = new NodeCache({ stdTTL: 900 });

class SearchService {
  public sitterService = new SitterService();
  public hotelService = new HotelService();

  public async search(searchRequest: SearchRequestDto) {
    const category = searchRequest.category;
    if (cache.has(category)) {
      return cache.get(category);
    }

    if (SearchCategoryType.HOTEL === category) {
      return this.hotelService.getHotels(cache);
    }

    return this.sitterService.getSittersByCategory(category, cache);
  }
}

export default SearchService;
