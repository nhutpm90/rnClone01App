import API from '../utils/API';
import Request from '../utils/Request';

import { LoggerUtils } from '../utils/Utils';

const AccountService = {

    login(username, password) {
        LoggerUtils.log('AccountService:: login', 'username', username, 'password', password);
        return API.accessToken(new Request().fromUrl("/oauth/token"), username, password);
    },

    hubAccountInfo(username) {
        LoggerUtils.log('AccountService:: hubAccountInfo', 'username', username);
        return new Request().fromUrl(`/hub/account/info`)
        .authentication(false)
        .requestParams({ 
            username: username
        }).doGet();
    }
};

export default AccountService;
