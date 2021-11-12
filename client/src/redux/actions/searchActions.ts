import axios from "axios";
import {SitterSourceType} from "../../../../server/src/enums/sitter.source.type";
import {SearchCategoryType} from "../../components/CategoryTabs";

export interface Sitter {
  id?: string;
  externalId: string;
  fullName: string;
  location: string;
  price?: any;
  source: SitterSourceType;
  name?: string;
  fullAddress?: string;
  phone?: string;
  rating?: number;
  icon?: string
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
