class AppUrl {
  static BaseURL = 'http://127.0.0.1:8000/api/v1';

  static config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  static AllBrands = `${this.BaseURL}/brands`;

  static Categries = `${this.BaseURL}/categories`;
}

export default AppUrl;
