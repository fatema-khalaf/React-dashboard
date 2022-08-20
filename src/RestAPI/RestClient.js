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

  static CreateRequest = (url, formData, setError) => {
    return privateAxios
      .post(url, formData)
      .then((response) => {
        return 'Add success!';
      })
      .catch((error) => {
        if (!error.response.data) {
          throw new Error('Server Not availabe, Please try again later!');
        }
        if (error.response.data) {
          // Request made and server responded
          if (error.response.status === 404) {
            throw new Error('Something went wrong, Please try again later!');
          }

          const keys = Object.keys(error.response.data.errors);
          console.log(keys);
          keys.forEach((key, index) => {
            setError(key, { type: 'type', message: error.response.data.errors[key] });
          });
        } else {
          // Something happened in setting up the request that triggered an
          throw new Error('Internal Error, Please try again later!');
        }
      });
  };
}

export default RestClient;
