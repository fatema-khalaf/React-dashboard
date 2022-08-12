import axios from 'axios';
import AppUrl from './AppUrl';
import privateAxios from './axios';

class RestClient {
  static GetRequest = (getUrl) => {
    return privateAxios
      .get(getUrl)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return null;
      });
  };

  static PostRequest = (postUrl, postJson) => {
    return privateAxios
      .post(postUrl, postJson)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  };
}

export default RestClient;
