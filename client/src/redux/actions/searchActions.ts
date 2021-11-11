import axios from "axios";

export type DataSearchType = {
  data: null;
}

export interface ISearchAction {
  readonly type: 'FETCH_DATA';
  payload: DataSearchType;
}

export type SearchActions = ISearchAction


export function search() {
  return dispatch => {
    axios.get("http://localhost:3001/search")
      .then(res =>
        dispatch({
          type: "FETCH_DATA",
          data: res.data
        })
      );
  };
}
