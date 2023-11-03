import axios from 'axios';
import { addApiError } from '../Feedback/actions';

export const addInterceptorToStore = store => {
  // Add a response interceptor
  axios.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error) {
      // Do something with response error
      store.dispatch(addApiError(error.response));
      return Promise.reject(error);
    }
  );
};
