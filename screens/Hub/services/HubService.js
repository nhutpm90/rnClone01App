import API from '../utils/API';
import Request from '../utils/Request';

import { LoggerUtils } from '../utils/Utils';

const HubService = {

    hubDetail(hubCode) {
        LoggerUtils.log('HubService:: hubDetail', 'hubCode', hubCode);
        return new Request().fromUrl(`/hub/${hubCode}`).doGet();
    },
    putIntoShelf(hubCode, boxCode, orderCode, parcelDimension) {
        LoggerUtils.log('HubService:: putIntoShelf', 'hubCode', hubCode, 'boxCode', boxCode, 'orderCode', orderCode, 'parcelDimension', parcelDimension);
        return new Request().fromUrl(`/box/manual/${hubCode}/${boxCode}/dropoff`)
        .requestParams({ 
            orderCode: orderCode,
            parcelDimension: parcelDimension 
        })
        .doPost();
    },
    handover(hubCode, boxCode, orderCode) {
        LoggerUtils.log('HubService:: handover', 'hubCode', hubCode, 'boxCode', boxCode, 'orderCode', orderCode);
        return new Request().fromUrl(`/box/manual/${hubCode}/${boxCode}/pickup`)
        .requestParams({ 
            orderCode: orderCode
        })
        .doPost();
    },
    acceptOrders(orders) {
        LoggerUtils.log('HubService:: acceptOrders', 'orders', JSON.stringify(orders));
        return new Request().fromUrl(`/hub/manual/orders/list`)
        .withContentType("application/json")
        .requestBody(orders)
        .doPost();
    },
    verifyOTP(hubCode, otp) {
        LoggerUtils.log('HubService:: verifyOTP', 'hubCode', hubCode, 'otp', otp);
        return new Request().fromUrl(`/box/token/verify/${hubCode}`)
        .requestParams({ 
            token: otp
        })
        .doPost();
    },
    
};

export default HubService;