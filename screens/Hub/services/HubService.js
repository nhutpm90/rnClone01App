import API from '../utils/API';
import Request from '../utils/Request';

const HubService = {

    hubDetail(hubCode) {
        return new Request().fromUrl(`/hub/${hubCode}`).doGet();
    }

};

export default HubService;