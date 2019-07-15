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
    inboundOutboundOrders(hubCode, driverCode) {
        LoggerUtils.log('OrderService:: inboundOutboundOrders', 'hubCode', hubCode, 'driverCode', driverCode);
        return new Request().fromUrl(`/hub/${hubCode}/driver/${driverCode}`)
        .doGet();
    },
    assignStamp(orderCode, stamp) {
        LoggerUtils.log('OrderService:: assignStamp', 'orderCode', orderCode, 'stamp', stamp);
        return new Request().fromUrl(`/stamp/${stamp}`)
        .requestParams({ orderCode: orderCode })
        .doPost();
    },
    changeOrderStatus(orderCode, params) {
        // const params = { 
        //     status: status,
        //     collectFee: collectFee,
        //     collectCod: collectCod,
        //     paymentType: paymentType,
        //     note: note,
        //     hubCode: hubCode,
        //     lat: lat,
        //     lng: lng,
        // };
        LoggerUtils.log('OrderService:: changeOrderStatus', 
                            'orderCode', orderCode, 'params', JSON.stringify(params));
        return new Request().fromUrl(`/hub/manual/orders/${orderCode}`)
        .requestParams(params)
        .doPost();
    },
    // debug code start
    getLatestOrder(callback) {
        AccountService.login("om", "ilove1log1c").then(response => {
            const data = response.data;
            const accessToken = data["access_token"]
            API.doGet(
                new Request().fromUrl(`/operation/orders/filter`)
                .requestParams({ orderTypeList: 'FO,SO,EO,EXTERNAL_FO' }), accessToken
            ).then(response => {
                const order = response.data.data[0];
                const orderCode = _.get(order, 'orderCode');
                console.log(`getLatestOrder:: orderCode['${orderCode}']`);
                callback(orderCode);
            });
        });
    },
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