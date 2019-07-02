import API from '../utils/API';
import Request from '../utils/Request';

const AccountService = {

    login(username, password) {
        return API.accessToken(new Request().fromUrl("/oauth/token"), username, password);
    },

    hubAccountInfo(username) {
        // https://alpha.ilogic.vn:8080/auth/hub/account/info?username=0909795262
        return new Request().fromUrl(`/hub/account/info`)
        .authentication(false)
        .requestParams({ 
            username: username
        }).doGet();
    }
    // accessToken(cb) {
    //     console.log("read accessToken");
    //     this.readUser(function(user) {
    //         console.log(`readUser ${JSON.stringify(user)}`);
    //         cb(user['access_token']);
    //     });
    // },

    // writeUser(user, callback) {
        
    // },

    // readUser(callback) {
    //     console.log("readUser authentication");
    //     StorageUtils.read("user").then((value) => {
    //         callback(JSON.parse(value));
    //     });
    // },

};

export default AccountService;
