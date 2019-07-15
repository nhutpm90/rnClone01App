import _ from 'lodash';

import { LoggerUtils } from '../utils/Utils';
import Request from './../utils/Request';
import { PAYMENT_TYPES } from '../utils/Constants';

const PaymentService = {

    requestPayment(paymentType, amount, orderInfo) {
        const { MOMO, VNPAY } = PAYMENT_TYPES;
        if(paymentType == MOMO) {
            return this.requestMoMoPayment(amount, orderInfo);
        } else if(paymentType == VNPAY) {
            return this.requestVNPayPayment(amount, orderInfo);
        } else {
            LoggerUtils.log('PaymentService:: requestPayment:: paymentType is not supported', 
            'paymentType', paymentType);
        }
    },
    requestMoMoPayment(amount, orderInfo) {
        LoggerUtils.log('PaymentService:: requestMoMoPayment', 
            'amount', amount, 'orderInfo', orderInfo);
        const data = {
            "amount": amount,
            "orderInfo": orderInfo,
            "extraData": "",
        };
        return new Request().fromPaymentUrl(`/momo/m2/request-payment`)
            .withContentType("application/json")
            .requestBody(data)
            .doPost();
        // {
        //     "success": true,
        //     "data": {
        //         "transId": 3860,
        //         "payUrl": "https://test-payment.momo.vn/gw_payment/payment/qr?partnerCode=MOMOIQA420180417&accessKey=SvDmj2cOTYZmQQ3H&requestId=61d00c05-119b-455d-8914-98d2784d4277&amount=16000&orderId=bb920883-80a0-4c5d-9916-e483421a8f30&signature=4773bba55786f48d6999b7bb04c44c98e2c29ef934efbab2fb6b0e818aeadefe&requestType=captureMoMoWallet&action=payWithAppToken&amount=16000&requestType=payment&partnerCode=MOMOIQA420180417&orderId=bb920883-80a0-4c5d-9916-e483421a8f30&extraData=&fee=0&orderLabel=M%C3%A3+%C4%91%C6%A1n+h%C3%A0ng&packageId=&description=Nhut+Test+Generate&extras=&language=vi&merchantnamelabel=Nh%C3%A0+cung+c%E1%BA%A5p&gatewayMerchantCode=MOMOIQA420180417&createdAt=1562923604099&merchantcode=MOMOIQA420180417&requestId=bb920883-80a0-4c5d-9916-e483421a8f30&deeplinkCallback=https%3A%2F%2Ftest-payment.momo.vn%2Fgw_payment%2Fm2%3Fid%3DLv5j0M&urlSubmitToken=https%3A%2F%2Ftest-payment.momo.vn%2Fgw_payment%2Fpayment_with_app%3FpartnerCode%3DMOMOIQA420180417%26accessKey%3DSvDmj2cOTYZmQQ3H%26requestId%3D61d00c05-119b-455d-8914-98d2784d4277%26orderId%3Dbb920883-80a0-4c5d-9916-e483421a8f30%26orderInfo%3DNhut%2BTest%2BGenerate%26amount%3D16000%26signature%3D4773bba55786f48d6999b7bb04c44c98e2c29ef934efbab2fb6b0e818aeadefe%26requestType%3DcaptureMoMoWallet%26payType%3Dapp-in-app&appScheme=&hmac=b1874240cf07815ccd762cbbd085a6c5b9066380dbcad1e7b36f94fd42abe3ab&merchantname=BeVolunteer&callbackUrl=https%3A%2F%2Ftest-payment.momo.vn%2Fgw_payment%2Fm2%3Fid%3DLv5j0M",
        //         "deeplink": "momo://?action=payWithAppToken&amount=16000&requestType=payment&partnerCode=MOMOIQA420180417&orderId=bb920883-80a0-4c5d-9916-e483421a8f30&extraData=&fee=0&orderLabel=M%C3%A3+%C4%91%C6%A1n+h%C3%A0ng&packageId=&description=Nhut+Test+Generate&extras=&language=vi&merchantnamelabel=Nh%C3%A0+cung+c%E1%BA%A5p&gatewayMerchantCode=MOMOIQA420180417&createdAt=1562923604099&merchantcode=MOMOIQA420180417&requestId=bb920883-80a0-4c5d-9916-e483421a8f30&deeplinkCallback=https%3A%2F%2Ftest-payment.momo.vn%2Fgw_payment%2Fm2%3Fid%3DLv5j0M&urlSubmitToken=https%3A%2F%2Ftest-payment.momo.vn%2Fgw_payment%2Fpayment_with_app%3FpartnerCode%3DMOMOIQA420180417%26accessKey%3DSvDmj2cOTYZmQQ3H%26requestId%3D61d00c05-119b-455d-8914-98d2784d4277%26orderId%3Dbb920883-80a0-4c5d-9916-e483421a8f30%26orderInfo%3DNhut%2BTest%2BGenerate%26amount%3D16000%26signature%3D4773bba55786f48d6999b7bb04c44c98e2c29ef934efbab2fb6b0e818aeadefe%26requestType%3DcaptureMoMoWallet%26payType%3Dapp-in-app&appScheme=&hmac=b1874240cf07815ccd762cbbd085a6c5b9066380dbcad1e7b36f94fd42abe3ab&merchantname=BeVolunteer&callbackUrl=https%3A%2F%2Ftest-payment.momo.vn%2Fgw_payment%2Fm2%3Fid%3DLv5j0M",
        //         "qrData": "https://test-payment.momo.vn/gw_payment/s/ZxAmqY"
        //     }
        // }
    },
    requestVNPayPayment(amount, orderInfo) {
        LoggerUtils.log('PaymentService:: requestVNPayPayment', 
            'amount', amount, 'orderInfo', orderInfo);
        return new Request().fromPaymentUrl(`/vnpay/qr/request-payment`)
            .requestParams({ 
                amount: amount,
                "orderInfo": orderInfo,
            })
            .doPost();
            // {
            //     "success": true,
            //     "data": {
            //         "transId": 3967,
            //         "qrData": "00020101021226280010A000000775011003144389655204421453037045405150005802VN5906ILOGIC6003HCM6240010439670316ILOGIC OFFLINE 10708ILOGIC016304549C"
            //     }
            // }
    },
    paymentStatus(transId) {
        LoggerUtils.log('OrderService:: paymentStatus', 'transId', transId);
        return new Request().fromPaymentUrl(`/payment/status/${transId}`)
        .doGet();
        // {
        //     "success": false,
        //     "data": {
        //         "errorCode": "ECS_PAYMENT_01",
        //         "params": null
        //     }
        // }
    },
    addTransaction(orderCode, transId, totalFee) {
        LoggerUtils.log('PaymentService:: addTransaction', 
            'orderCode', orderCode, 'transId', transId, 'totalFee', totalFee);
        return new Request().fromUrl(`/orders/transaction/${orderCode}`)
        .requestParams({ 
            transactionId: transId,
            totalFee: totalFee
        })
        .doPost();
    }
};

export default PaymentService;