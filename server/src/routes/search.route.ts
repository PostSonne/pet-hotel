import { Router } from 'express';
import { Routes } from 'interfaces/routes.interface';
import SearchController from 'controllers/search.controller';
import validationMiddleware from '../middlewares/validation.middleware';
import { SearchRequestDto } from '../dtos/rq/search.request.dto';

class SearchRoute implements Routes {
  public path = '/search';
  public router = Router();
  public searchController = new SearchController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddleware(SearchRequestDto, 'body'), this.searchController.search);
  }
}

export default SearchRoute;
