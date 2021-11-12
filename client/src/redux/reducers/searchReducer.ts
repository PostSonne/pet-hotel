import {SearchActions, SearchResponseType} from "../actions/searchActions"

const initialState: SearchResponseType = {
  data: [],
  size: null
};

const SearchReducer = (state: SearchResponseType = initialState, action: SearchActions) => {
  switch (action.type) {
    case 'FETCH_DATA':
      return {
        ...state,
        data: action.payload.data,
        size: action.payload.size
      }
    default:
      return state;
  }
}
export default SearchReducer;
