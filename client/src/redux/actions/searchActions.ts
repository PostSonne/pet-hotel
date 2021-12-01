import axios from "axios";
import {SitterSourceType} from "../../../../server/src/enums/sitter.source.type";
import {SearchCategoryType} from "../../components/CategoryTabs";
import {Geo} from "../../../../server/src/interfaces/geo.interface";
import {PetType} from "../../../../server/src/enums/pet.type";

export interface Sitter {
  id?: string;
  externalId: string;
  source: SitterSourceType;
  name: string;
  address: string;
  location: string;
  geo: Geo;
  avatar: string;
  icon?: string;
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

export type SearchResponseType = {
  data: Sitter[];
  size: number;
}

export interface ISearchAction {
  readonly type: 'FETCH_DATA';
  payload: SearchResponseType;
}

export type SearchActions = ISearchAction

export function searchPetSitters(category: SearchCategoryType) {
  return dispatch => {
    axios({
      method: "POST",
      url: "http://localhost:3001/search",
      data: {
        category: category,
      },
    })
      .then(res =>
        dispatch({
          type: "FETCH_DATA",
          payload: res.data
        })
      );
  };
}
