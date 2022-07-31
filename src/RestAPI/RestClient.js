import axios from 'axios';

class RestClient {
  static GetRequest = (getUrl) => {
    return axios
      .get(getUrl)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return null;
      });
  };

  static PostRequest = (postUrl, postJson) => {
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    return axios
      .post(postUrl, postJson, config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  };
}

export default RestClient;
