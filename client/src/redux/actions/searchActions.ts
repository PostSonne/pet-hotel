import axios from "axios";
import {SitterSourceType} from "../../../../server/src/enums/sitter.source.type";

export interface Sitter {
  id?: string;
  externalId: string;
  fullName: string;
  location: string;
  price?: any;
  source: SitterSourceType;
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

export function search() {
  return dispatch => {
    axios({
      method: "POST",
      url: "http://localhost:3001/search",
      data: {
        category: "DOGSITTING",
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
