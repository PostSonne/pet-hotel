import {NextFunction, Request, Response} from "express";
import SearchService from "services/search.service";

class SearchController {
  public searchService = new SearchService();

  public search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchResult = await this.searchService.search();
      res.status(200).json({ data: searchResult });
    } catch (error) {
      next(error);
    }
  }
}

export default SearchController;
