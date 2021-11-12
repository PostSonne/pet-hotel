import {applyMiddleware, compose, createStore} from 'redux'
import rootReducer from "../reducers/rootReducer";
import thunk from "redux-thunk";

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
export default store;
