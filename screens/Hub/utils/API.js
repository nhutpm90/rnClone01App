import axios from "axios";

import masterStore from '../store/MasterStore';

// used to capture http request in chrome debugger network tab
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

const API = {

  accessToken(request, username, password) {
    console.log(`accessToken:: 
        request['${JSON.stringify(request)}'] - username['${username}'] - password['${password}']`);

    var clientInfo = "trusted-app" + ":" + "secret";
    // var encoded = btoa(clientInfo);
    var encoded = "dHJ1c3RlZC1hcHA6c2VjcmV0";

    return axios.post(
        request.url, 
        null, 
        {
            headers: {
                'Authorization': `Basic ${encoded}`,
                'Content-type': "application/x-www-form-urlencoded; charset=utf-8"
            },
            params: {
                grant_type: "password",
                username: username,
                password: password,
            }
        }
    );
  },

  doGet(request, accessToken) {
    if(accessToken == undefined) {
        accessToken = masterStore.getAccessToken();
    }
    console.log("doGet:: " + JSON.stringify(request));
    return axios.get(
        request.url, 
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-type': "application/x-www-form-urlencoded; charset=utf-8"
            },
            params: request.params
        }
    );
  },

  doPost(request) {
    console.log("doPost:: " + JSON.stringify(request));
    return axios.post(
        request.url, 
        request.data, 
        {
            headers: {
                'Authorization': `Bearer ${masterStore.getAccessToken()}`,
                'Content-type': "application/x-www-form-urlencoded; charset=utf-8"
            },
            params: request.params
        });
  }
};

export default API;
