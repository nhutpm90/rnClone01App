import axios from "axios";

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

  doGet(request) {
    console.log("doGet:: " + JSON.stringify(request));
    return axios.get(request.url, 
        {
            headers: {
                'Authorization': `Bearer ${request.accessToken}`,
                'Content-type': "application/x-www-form-urlencoded; charset=utf-8"
            },
            params: request.params
        }
    );
  },

  doPost(request) {
    console.log("doPost:: " + JSON.stringify(request));

    var clientInfo = "trusted-app" + ":" + "secret";
    // var encoded = btoa(clientInfo);
    var encoded = "dHJ1c3RlZC1hcHA6c2VjcmV0";

    return axios.post(
        request.url, 
        request.params, {
         headers: request.headers
        })
        .then(response => {
            console.log("response " + JSON.stringify(response));
        }
    );
  }
};

export default API;
