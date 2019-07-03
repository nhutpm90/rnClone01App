import API from '../utils/API';
import Request from '../utils/Request';

import { LoggerUtils } from '../utils/Utils';

const HubService = {

    hubDetail(hubCode) {
        LoggerUtils.log('HubService:: hubDetail', 'hubCode', hubCode);
        return new Request().fromUrl(`/hub/${hubCode}`).doGet();
    }
};

export default HubService;