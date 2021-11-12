import { NextFunction, Request, Response } from 'express';
import SearchService from 'services/search.service';
import { SearchRequestDto } from '../dtos/rq/search.request.dto';

class SearchController {
  public searchService = new SearchService();

  public search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchRequest: SearchRequestDto = req.body;
      const searchResult = await this.searchService.search(searchRequest);
      res.status(200).json({ data: searchResult, size: searchResult.length });
    } catch (error) {
      next(error);
    }
  };
}

export default SearchController;
