import _ from 'lodash';

import { LoggerUtils } from '../utils/Utils';
import API from '../utils/API';

import AccountService from './AccountService';

import Request from './../utils/Request';

const OrderService = {

    orderDetail(id) {
        LoggerUtils.log('OrderService:: orderDetail', 'id', id);
        return new Request().fromUrl(`/orders/${id}`).doGet();
    },
    orderDetailByOrderCode(orderCode) {
        LoggerUtils.log('OrderService:: orderDetailByOrderCode', 'orderCode', orderCode);
        return new Request().fromUrl(`/orders/code`)
        .requestParams({ code: orderCode })
        .doGet();
    },
    ordersByBoxId(boxId) {
        LoggerUtils.log('OrderService:: ordersByBoxId', 'boxId', boxId);
        return new Request().fromUrl(`/box/${boxId}/orderInfo/list`)
        .doGet();
    },
    assignStamp(orderCode, stamp) {
        LoggerUtils.log('OrderService:: assignStamp', 'orderCode', orderCode, 'stamp', stamp);
        return new Request().fromUrl(`/stamp/${stamp}`)
        .requestParams({ orderCode: orderCode })
        .doPost();
    },
    atHub(orderCode, hubCode) {
        LoggerUtils.log('OrderService:: atHub', 'orderCode', orderCode, 'hubCode', hubCode);
        // https://alpha.ilogic.vn:8080/auth/hub/manual/orders/ILG004325?collectCod=false&collectFee=false&hubCode=HQ3-01&status=FO_AT_HUB
        return new Request().fromUrl(`/hub/manual/orders/${orderCode}`)
        .requestParams({ 
            collectCod: false,
            collectFee: false,
            hubCode: hubCode,
            status: 'FO_AT_HUB',
        }).doPost();
    },
    // debug code start
    getAvailableStamp(callback) {
        AccountService.login("om", "ilove1log1c").then(response => {
            const data = response.data;
            const accessToken = data["access_token"]
            API.doGet(
                new Request().fromUrl(`/operation/code/stamp/filter`)
                .requestParams({ available: true }), accessToken
            ).then(response => {
                const stamp = response.data.data[0];
                const stampId = _.get(stamp, 'stampId');
                console.log(`getAvailableStamp:: stampId['${stampId}']`);
                callback(stampId);
            });
        });
    },
    // debug code end
};

export default OrderService;