import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { addInterceptorToStore } from '../core/http/httpInterceptor';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

let storeInstance; //eslint-disable-line
const sagaMiddleware = createSagaMiddleware();

function configureStore(initialState) {
  const enhancer =
    process.env.NODE_ENV !== 'production'
      ? composeWithDevTools(applyMiddleware(..._getMiddleWare()))
      : applyMiddleware(..._getMiddleWare());
  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(rootSaga);
  addInterceptorToStore(store);

  storeInstance = store;

  return store;
}

function _getMiddleWare() {
  const middleware = [sagaMiddleware];
  return middleware;
}

export { storeInstance };
export default configureStore;
