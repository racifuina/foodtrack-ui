import { createStore, combineReducers } from 'redux';
import reducers from './reducers';

export default function Store(persistedState) {
  return createStore(combineReducers({ ...reducers }), persistedState);
}