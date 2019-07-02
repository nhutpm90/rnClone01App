import _ from 'lodash';

import User from './User';

class Store {
    constructor() {
        
    }
    setUser(credentials) {
        this.user = new User(credentials);
    }
    getUser() {
        return this.user;
    }
    getAccessToken() {
        return _.get(this.getUser(), "credentials.access_token");
    }
}

const store = new Store();
export default store;