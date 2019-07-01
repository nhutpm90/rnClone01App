import API from './API';

import AccountService from './../services/AccountService';

export default class Request {
  // baseUrl = 'http://jsonplaceholder.typicode.com';
  baseUrl = 'https://alpha.ilogic.vn:8080/auth';
  
  constructor() {
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

  doGet() {
    const self = this;
    AccountService.accessToken(function(accessToken) {
      self.accessToken = accessToken;
      return API.doGet(self);
    })
  }

  doPost() {
    return API.doPost(this);
  }
}