import { combineReducers } from 'redux'
import SearchReducer from "./searchReducer";

const rootReducer = combineReducers({
  searchResult: SearchReducer,
})
export type AppState = ReturnType<typeof rootReducer>
export default rootReducer;
