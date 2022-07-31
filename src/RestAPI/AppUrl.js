class AppUrl {
  static BaseURL = 'http://127.0.0.1:8000/api/v1';
  //  static BaseURL = 'https://rapi.fgclbd.com/api';

  static config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  static AllBrands = `${this.BaseURL}/brands`;
}

export default AppUrl;
