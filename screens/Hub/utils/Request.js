import _ from 'lodash';
import API from './API';
import { SERVER } from '../utils/Constants';

export default class Request {
  // baseUrl = 'http://jsonplaceholder.typicode.com';
  // baseUrl = 'https://alpha.ilogic.vn:8080/auth';

  constructor() {
    this.isAuth = true;
    // this.contentType = "application/json";
  }

  fromUrl(url) {
    this.url = _.get(SERVER, 'AUTH_SERVER.URL') + url;
    return this;
  }

  fromPaymentUrl(url) {
    this.url = _.get(SERVER, 'PAYMENT_SERVER.URL') + url;
    return this;
  }

  withContentType(contentType) {
    this.contentType = contentType;
    return this;
  }

  requestBody(data) {
    this.data = data;
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