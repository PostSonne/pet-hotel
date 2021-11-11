import {DataSearchType, SearchActions} from "../actions/searchActions"

const initialState: DataSearchType = {
  data: null
};

const SearchReducer = (state: DataSearchType = initialState, action: SearchActions) => {
  switch(action.type) {
    case 'FETCH_DATA':
      return {
        ...state,
        data: action.payload
      }
    default:
      return state;
  }
}
export default SearchReducer;
