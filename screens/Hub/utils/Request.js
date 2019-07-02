import API from './API';

export default class Request {
  // baseUrl = 'http://jsonplaceholder.typicode.com';
  baseUrl = 'https://alpha.ilogic.vn:8080/auth';
  
  constructor() {
    this.isAuth = true;
    this.contentType = "application/json";
  }

  fromUrl(url) {
    this.url = this.baseUrl + url;
    return this;
  }

  requestParams(params) {
    this.params = params;
    return this;
  }

  authentication(isAuth) {
    this.isAuth = isAuth;
    return this;
  }

  doGet() {
    return API.doGet(this);
  }

  doPost() {
    return API.doPost(this);
  }
}