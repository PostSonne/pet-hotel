import { Router } from 'express';
import { Routes } from 'interfaces/routes.interface';
import SearchController from 'controllers/search.controller';

class SearchRoute implements Routes {
  public path = '/search';
  public router = Router();
  public searchController = new SearchController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.searchController.search);
  }
}

export default SearchRoute;
