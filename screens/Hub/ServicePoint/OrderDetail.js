import React, { Component } from "react";

import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert, Vibration,
  ActivityIndicator, RefreshControl } from "react-native";

import { Container, Header, Title, Subtitle, Content, Item, Form, Label,
  View as ViewNB, Text as TextNB, Input, Button, Icon as IconNB, Left, Right, Body, Radio, ListItem,
  Footer, FooterTab, Badge, ActionSheet, Spinner, Picker, H1, H2, H3 } from "native-base";

import QRCode from "react-native-qrcode-svg";

import _ from 'lodash';

import CodeScanner from '../components/CodeScanner';

import { DateTimeUtils, LoggerUtils, NavigationUtils } from '../utils/Utils';

import { stormWebsocket, timer } from '../utils/BackgroundProcesses';

import OrderService from '../services/OrderService';
import HubService from '../services/HubService';
import PaymentService from './../services/PaymentService';

import { ORDER_STATUSES, PAYMENT_TYPES, OrderStatusUtils } from '../utils/Constants';

export default class App extends Component {

  constructor(props) {
    super(props);
    
    const { navigation } = props;
    const orderCode = navigation.getParam('orderCode', '');
    const deliverFlag = navigation.getParam('deliverFlag', false);
    
    LoggerUtils.log('init OrderDetail', 'orderCode', orderCode);

    const { CASH, MOMO, VNPAY } = PAYMENT_TYPES;

    const paymentOptions = [
      this.createPaymentOption(CASH, true, 'Tiền mặt', ''),
      this.createPaymentOption(MOMO, false, 'MoMo', ''),
      this.createPaymentOption(VNPAY, false, 'VNPay', '')
    ];

    this.state = {
      refreshing: false,
      orderCode,
      deliverFlag,
      showStampScanner: false,
      showShelfScanner: false,
      showPayment: false,
      // showPayment: true,
      paymentTypes: PAYMENT_TYPES,
      paymentOptions: paymentOptions,
      qrData: '',
      // orderDetail: {},
    };

    const ACTION_SCAN_STAMP = "ACTION_SCAN_STAMP";
    const ACTION_PUT_INTO_SHELF = "ACTION_PUT_INTO_SHELF";

    this.options = {
      ACTION_SCAN_STAMP, 
      ACTION_PUT_INTO_SHELF,
    }

    // add payment callback
    // stormWebsocket.connect();
    // stormWebsocket.addPaymentCallback((data) => {
    //   LoggerUtils.log('Boxes:: setOnPaymentReceived', 'data', data);
    // }, true);

    // add timer
    // timer.startPaymentTimer(() => {
    //   const { orderDetail } = this.state;
    //   const selectedPayment = _.find(paymentOptions, { selected: true });
    //   this._updatePaymentTransaction(orderDetail, selectedPayment);
    // }, () => {
    //   this._paymentTimeoutCb();
    // });
  }

  _updatePaymentTransaction = (orderDetail, selectedPayment) => {
    if(orderDetail != undefined) {
      const { paymentOptions, paymentTypes } = this.state;
      const { orderCode, totalFee } = orderDetail;
      const { CASH, MOMO, VNPAY } = paymentTypes;
      
      
      
      LoggerUtils.log('OrderDetail:: _updatePaymentTransaction', 
        'orderCode', orderCode, 'totalFee', totalFee,
        'paymentType', type, 'transId', transId);
      if(type != CASH && transId != undefined && transId != '') {
        PaymentService.paymentStatus(transId).then(response => {
          LoggerUtils.log('OrderDetail:: _updatePaymentTransaction:: paymentStatus', 
            'transId', transId, 'data', JSON.stringify(response));
          if(_.get(response, 'data.success') == true) {
            const newPaymentOptions = [ ...paymentOptions ];
            const targetPaymentOption = _.find(newPaymentOptions, {transId: transId});
            _.set(targetPaymentOption, 'paymentCompleted', true);
            _.set(targetPaymentOption, 'status', 'Đã thanh toán');
            this.setState({ paymentOptions: newPaymentOptions });
            PaymentService.addTransaction(orderCode, transId, totalFee).then(response => {
              LoggerUtils.log('OrderDetail:: _updatePaymentTransaction:: addTransaction', 
                'orderCode', orderCode, 'transId', transId, 'totalFee', totalFee,
                 'data', JSON.stringify(response));
            });
          } else {
            const data = _.get(response, 'data.data');
            const errorCode = _.get(data, 'errorCode');
            if(errorCode == 'ECS_PAYMENT_01') {
              // waiting for payment
            } else {
              const params = _.get(data, 'params');
              LoggerUtils.log('OrderDetail:: _updatePaymentTransaction:: error', 
                'errorCode', errorCode, 'params', JSON.stringify(params));
            }
          }
        });
      } else {
        LoggerUtils.log('OrderDetail:: _updatePaymentTransaction:: skip checking');
      }
    }
  }

  _paymentTimeoutCb = () => {
    LoggerUtils.log('OrderDetail:: _paymentTimeoutCb');
    // const { orderDetail, paymentOptions, paymentTypes } = this.state;
    // if(orderDetail != undefined) {
    //   const { orderCode, totalFee } = orderDetail;
    //   const { CASH, MOMO, VNPAY } = paymentTypes;
      
    //   const paymentSelected = _.find(paymentOptions, { selected: true });
    //   const { type, transId } = paymentSelected;
      
    //   LoggerUtils.log('OrderDetail:: _updatePaymentTransaction', 
    //     'orderCode', orderCode, 'totalFee', totalFee,
    //     'paymentType', type, 'transId', transId);
    //   if(type != CASH && transId != undefined && transId != '') {
    //     PaymentService.paymentStatus(transId).then(response => {
    //       LoggerUtils.log('OrderDetail:: _updatePaymentTransaction:: paymentStatus', 
    //         'transId', transId, 'data', JSON.stringify(response));
    //       if(_.get(response, 'data.success') == true) {
    //         const newPaymentOptions = [ ...paymentOptions ];
    //         const targetPaymentOption = _.find(newPaymentOptions, {transId: transId});
    //         _.set(targetPaymentOption, 'paymentCompleted', true);
    //         _.set(targetPaymentOption, 'status', 'Đã thanh toán');
    //         this.setState({ paymentOptions: newPaymentOptions });
    //         PaymentService.addTransaction(orderCode, transId, totalFee).then(response => {
    //           LoggerUtils.log('OrderDetail:: _updatePaymentTransaction:: addTransaction', 
    //             'orderCode', orderCode, 'transId', transId, 'totalFee', totalFee,
    //              'data', JSON.stringify(response));
    //         });
    //       } else {
    //         const data = _.get(response, 'data.data');
    //         const errorCode = _.get(data, 'errorCode');
    //         if(errorCode == 'ECS_PAYMENT_01') {
    //           // waiting for payment
    //         } else {
    //           const params = _.get(data, 'params');
    //           LoggerUtils.log('OrderDetail:: _updatePaymentTransaction:: error', 
    //             'errorCode', errorCode, 'params', JSON.stringify(params));
    //         }
    //       }
    //     });
    //   } else {
    //     LoggerUtils.log('OrderDetail:: _updatePaymentTransaction:: skip checking');
    //   }
    // }
  }

  createPaymentOption(type, selected, text, transId) {
    const qrData = '';
    const status = '';
    const paymentCompleted = false;
    return { type, selected, text, transId, qrData, status, paymentCompleted }
  }
  
  componentDidMount() {
    LoggerUtils.log('componentDidMount OrderDetail');
    this._refresh();
  }

  componentWillMount() {
    LoggerUtils.log('componentWillMount OrderDetail');
  }

  _canAssignStamp = (orderDetail) => {
    const stampId = _.get(orderDetail, 'stampId');

    const result = stampId == null || stampId == '' || stampId == undefined;

    LoggerUtils.log('_canAssignStamp', 'stampId', stampId, 'result', result);

    return result;
  }

  _canPutIntoShelf = (orderDetail) => {
    const { FO_SUBMITTED, SO_SUBMITTED, EO_SUBMITTED,
            FO_DELIVERED, SO_DELIVERED, EO_DELIVERED } = ORDER_STATUSES;
    
    const boxCode = _.get(this._getCurrentHub(orderDetail), 'boxInfo.code');
    
    const orderStatus = _.get(orderDetail, 'orderStatus');

    const result = (boxCode == null || boxCode == '' || boxCode == undefined)
          && !_.includes([ FO_SUBMITTED, SO_SUBMITTED, EO_SUBMITTED,
            FO_DELIVERED, SO_DELIVERED, EO_DELIVERED ], orderStatus);

    LoggerUtils.log('_canPutIntoShelf', 'orderStatus', orderStatus, 
          'boxCode', boxCode, 'result', result);

    return result;
  }

  _canAcceptOrder = (orderDetail) => {
    const { FO_SUBMITTED, SO_SUBMITTED, EO_SUBMITTED } = ORDER_STATUSES;

    const orderStatus = _.get(orderDetail, 'orderStatus');

    const result = _.includes([ FO_SUBMITTED, SO_SUBMITTED, EO_SUBMITTED ], orderStatus);
    
    LoggerUtils.log('_canAcceptOrder', 'orderStatus', orderStatus, 'result', result);
    return result;
  }

  _canHandover = (orderDetail) => {
    const { FO_ACCEPTED, SO_ACCEPTED, EO_ACCEPTED } = ORDER_STATUSES;

    const boxCode = _.get(orderDetail, 'pickupHub.boxInfo.code');
    const orderStatus = _.get(orderDetail, 'orderStatus');

    const result = (boxCode != null && boxCode != '' && boxCode != undefined)
              && _.includes([ FO_ACCEPTED, SO_ACCEPTED, EO_ACCEPTED ], orderStatus);

    LoggerUtils.log('_canHandover', 'boxCode', boxCode, 'orderStatus', orderStatus, 'result', result);
    return result;
  }

  onRefresh() {
    LoggerUtils.log("onRefresh OrderDetail");
    this._refresh();
  }

  _refresh = () => {
    this.setState({ refreshing: true });

    const { orderCode } = this.state;
    LoggerUtils.log('_refresh', 'orderCode', orderCode);
    OrderService.orderDetailByOrderCode(orderCode).then(response => {
      LoggerUtils.log('orderDetailByOrderCode', 'orderCode', orderCode, 'data', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        const orderDetail = _.get(response, 'data.data');
        this.setState({ orderDetail, refreshing: false });
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('_refresh OrderDetail:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
        this.setState({ refreshing: false });
      }
    });
  }

  _hideScanner = () => {
    LoggerUtils.log('_hideScanner');
    this.setState({ showStampScanner: false, showShelfScanner: false, qrData: '' });
  }

  _showScanner = (action) => {
    const { orderDetail } = this.state;
    const { ACTION_SCAN_STAMP, ACTION_PUT_INTO_SHELF } = this.options;
    const orderCode = _.get(orderDetail, "orderCode");
    
    LoggerUtils.log('_showScanner', 'orderCode', orderCode, 'action', action);

    switch(action) {
      case ACTION_SCAN_STAMP: 
        this.setState({ showStampScanner: true, showShelfScanner: false });
      
        // debug code start
        OrderService.getAvailableStamp((stampId) => {
          LoggerUtils.log('getAvailableStamp', 'stampId', stampId);
          this.setState({ qrData: stampId });
        });
        // debug code end
        break;
      case ACTION_PUT_INTO_SHELF:
        // this.setState({ showStampScanner: false, showShelfScanner: true });

        // debug code start
        this.setState({ showStampScanner: false, showShelfScanner: true, qrData: 'C01' });
        // debug code end
        break;
      default:
        break;
    }
  }

  _updateValue(field, text) {
    LoggerUtils.log('_updateValue', field, text);
    const newData = {};
    newData[field] = text;
    this.setState(newData);
  }

  _barcodeRecognized = (barcodes) => {
    const firstCode  = barcodes[0];
    const { data } = firstCode;

    LoggerUtils.log('_barcodeRecognized', 'data', data);
    this.setState({qrData: data});
  }

  _assignStamp = () => {
    const { orderCode, qrData } = this.state;
    LoggerUtils.log('_assignStamp', 'orderCode', orderCode, 'stamp', qrData);

    OrderService.assignStamp(orderCode, qrData).then(response => {
      LoggerUtils.log('_assignStamp', 'data', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        this._hideScanner();
        this._refresh();
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('_assignStamp:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
      }
    });
  }

  _getCurrentHub = (orderDetail) => {
    const { FO_AT_HUB_FOR_COLLECTION } = ORDER_STATUSES;

    let hub = _.get(orderDetail, "pickupHub");
    
    const orderStatus = _.get(orderDetail, 'orderStatus');
    if(_.includes([ FO_AT_HUB_FOR_COLLECTION ], orderStatus)) {
      hub = _.get(orderDetail, "dropOffHub");
    }
    return hub;
  }

  _putIntoShelf = () => {
    const { orderDetail, orderCode, qrData } = this.state;

    const hub = this._getCurrentHub(orderDetail);
    const hubCode = _.get(hub, 'code');

    const boxCode = qrData;
    const parcelDimension = _.get(orderDetail, "parcels[0].size");

    LoggerUtils.log('_putIntoShelf', 'hubCode', hubCode, 'boxCode', boxCode, 'orderCode', orderCode, 'parcelDimension', parcelDimension);

    HubService.putIntoShelf(hubCode, boxCode, orderCode, parcelDimension).then(response => {
      LoggerUtils.log('putIntoShelf', 'data', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        this._hideScanner();
        this._refresh();
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('_putIntoShelf:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
      }
    });
  }

  _acceptOrder = () => {
    const { orderDetail, paymentOptions } = this.state;
    const { totalFee, paidBySender} = orderDetail;

    const paymentCompleted = _.find(paymentOptions, { paymentCompleted: true });
    let showPayment = !paidBySender || totalFee != 0;
    
    showPayment = false; // debug code
    if(showPayment) {
      this._setVisiblePaymentScreen(true);
    } else {
      const orderCode = _.get(orderDetail, 'orderCode');
      const orderType = _.get(orderDetail, 'orderType');
      // const orderStatus = 'FO_AT_HUB';
      const orderStatus = OrderStatusUtils.atHubStatus(orderType);
  
      LoggerUtils.log('_acceptOrder', 'orderType', orderType, 'orderStatus', orderStatus);
      
      const hub = this._getCurrentHub(orderDetail);
      const hubCode = _.get(hub, 'code');
  
      const params = { 
        status: orderStatus,
        collectFee: false,
        collectCod: false,
        paymentType: undefined,
        note: undefined,
        hubCode: hubCode,
        lat: undefined,
        lng: undefined,
      };
  
      LoggerUtils.log('_acceptOrder', 'orderCode', orderCode, 'params', JSON.stringify(params));
      OrderService.changeOrderStatus(orderCode, params).then(response => {
        LoggerUtils.log('_acceptOrder:: changeOrderStatus', 'data', JSON.stringify(response));
        if(_.get(response, 'data.success') == true) {
          this._refresh();
        } else {
          const data = _.get(response, 'data.data');
          const errorCode = _.get(data, 'errorCode');
          const params = _.get(data, 'params');
          LoggerUtils.log('_acceptOrder:: changeOrderStatus error', 
            'errorCode', errorCode, 'params', JSON.stringify(params));
        }
      });
    }
  }

  _changePaymentType = (newPaymentType: string) => {
    const { paymentOptions } = this.state;
    const currentPaymentType = _.get(_.find(paymentOptions, { 'selected': true }), 'type');

    LoggerUtils.log('_changePaymentType', 
      'currentPaymentType', currentPaymentType,
      'newPaymentType', newPaymentType, 
      'paymentOptions', JSON.stringify(paymentOptions));

    if(currentPaymentType != newPaymentType) {
      let newPaymentOptions = [ ...paymentOptions ];

      _.set(_.find(newPaymentOptions, { 'selected': true }), 'selected', false);
      _.set(_.find(newPaymentOptions, { 'type': newPaymentType }), 'selected', true);

      LoggerUtils.log('_changePaymentType', 'newPaymentOptions', JSON.stringify(newPaymentOptions));
      this.setState({ paymentOptions: newPaymentOptions});
    }
  }

  _renderPaymentOptions(paymentOptions) {
    // old layout
    // const jsx = paymentOptions.map((item, index) => {
    //   const { type, selected, text, transId } = item;
    //   return (
    //     <ListItem key={type} selected={selected}
    //       onPress={() => this._changePaymentType(type)} >
    //       <Left>
    //         <TextNB>+ {text}</TextNB>
    //       </Left>
    //       <Right>
    //         <Radio selected={selected}
    //           onPress={() => this._changePaymentType(type)} />
    //       </Right>
    //     </ListItem>
    //   );
    // });
    // return jsx;

    // new layout
    const { orderDetail } = this.state;
    const totalFee = _.get(orderDetail, "totalFee");
    const selectedPayment = _.find(paymentOptions, { selected: true });

    const { transId, status, qrData } = selectedPayment;
    const selectedValue = _.get(selectedPayment, 'type');

    const textStyle = {
      color: "#000",
      fontSize: 18,
      marginVertical: 10,
    };
    
    return (
      <View>
        <H3>- Phương thức thanh toán</H3>
        <Picker
          mode="dropdown"
          iosIcon={<IconNB name="ios-arrow-down" />}
          style={{ width: undefined }}
          placeholder="Select your SIM"
          placeholderStyle={{ color: "#bfc6ea" }}
          placeholderIconColor="#007aff"
          selectedValue={selectedValue} 
          onValueChange={this._changePaymentType.bind(this)} >
            {
              paymentOptions.map((item, index) => {
                const { type, selected, text, transId } = item;
                return (
                  <Item key={type} label={text} value={type} />
                );
              })
            }
        </Picker>
        <View>
          <H3>- Thông tin thanh toán</H3>
          <View>
            <Text style={textStyle}>{`+ Số tiền: ${totalFee}`}</Text>
          </View>
        </View>
      </View>
    );
  }

  _renderPaymentQRCode(paymentOptions) {
    const { orderDetail } = this.state;

    const orderCode = _.get(orderDetail, "orderCode");
    const totalFee = _.get(orderDetail, "totalFee");

    const { CASH, MOMO, VNPAY } = this.state.paymentTypes;

    paymentOptions = [ ... paymentOptions];
    const selectedPayment = _.find(paymentOptions, { selected: true });
    const paymentType = _.get(selectedPayment, 'type');
    
    const { transId, status, qrData } = selectedPayment;
    
    if(paymentType != CASH && (transId == undefined || transId == '')) {
      const amount = totalFee;
      const orderInfo = `Thanh toán cho đơn hàng ${orderCode}`;
      // request payment
      PaymentService.requestPayment(paymentType, amount, orderInfo).then(response => {
        LoggerUtils.log('_renderPaymentQRCode:: requestPayment', 'data', JSON.stringify(response));
        if(_.get(response, 'data.success') == true) {
          const data = _.get(response, 'data.data');
          const { transId, qrData } = data;
          _.set(selectedPayment, 'transId', transId);
          _.set(selectedPayment, 'qrData', qrData);
          _.set(selectedPayment, 'status', 'Chờ thanh toán');
          this.setState({ paymentOptions });
        } else {
          const data = _.get(response, 'data.data');
          const errorCode = _.get(data, 'errorCode');
          const params = _.get(data, 'params');
          LoggerUtils.log('_renderPaymentQRCode:: requestPayment error', 
            'errorCode', errorCode, 'params', JSON.stringify(params));
        }
      });
    }
    
    const isPaymentByCash = paymentType == CASH;
    const textStyle = {
      color: "#000",
      fontSize: 18,
    };

    LoggerUtils.log("_renderPaymentQRCode", 'paymentType', paymentType, 
      'transId', transId, 'status', status, 'qrData', qrData);

    return (
      <View style={{
        flex: 1,
      }} >
        { !isPaymentByCash && qrData != '' && qrData != undefined &&
        <View style={{
          flex: 1, 
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}>
          <QRCode
            value={qrData}
            size={200} />
          <View style={{ flexDirection: 'column', marginTop: 10 }}>
            <Text style={textStyle}>{`- Trạng thái: ${status}`}</Text>
            <Text style={textStyle}>{`- Mã giao dịch: ${transId}`}</Text>
          </View>
        </View>
        }
      </View>
    );
  }

  _setVisiblePaymentScreen(visible) {
    this.setState({ showPayment: visible });
  }

  _renderPaymentScreen() {
    const { paymentOptions } = this.state;
    LoggerUtils.log('_renderPaymentScreen', 'paymentOptions', JSON.stringify(paymentOptions));

    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this._setVisiblePaymentScreen(false)}>
              <IconNB name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>Thanh toán</Title>
          </Body>
          <Right style={{flex: 1}}>
          </Right>
        </Header>
        <ViewNB padder style={{flex: 1}}>
          {this._renderPaymentOptions(paymentOptions)}
          {this._renderPaymentQRCode(paymentOptions)}
          {/* <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Title style={{color: "#FFF"}}>Thanh toán</Title>
          <Button primary full disabled style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
          }}>
            <Text>disabled</Text>
          </Button> */}
        </ViewNB>
        {/* <Footer>
          <FooterTab>
            <Button disabled full style={{ backgroundColor : '#051B49'}}
              onPress={() => {}}>
              <Title style={{ color: '#FFF' }}>Hoàn thành</Title>
            </Button>
          </FooterTab>
        </Footer> */}
      </Container>
    );
  }
  
  _deliverOrder = () => {
    const { orderDetail } = this.state;
    const orderCode = _.get(orderDetail, 'orderCode');
    const orderType = _.get(orderDetail, 'orderType');
    // const orderStatus = 'FO_DELIVERED';
    const orderStatus = OrderStatusUtils.deliveredStatus(orderType);

    const hub = this._getCurrentHub(orderDetail);
    const hubCode = _.get(hub, 'code');

    const params = { 
      status: orderStatus,
      collectFee: false,
      collectCod: false,
      paymentType: undefined,
      note: undefined,
      hubCode: hubCode,
      lat: undefined,
      lng: undefined,
    };

    LoggerUtils.log('_deliverOrder', 'orderCode', orderCode, 'params', JSON.stringify(params));
    OrderService.changeOrderStatus(orderCode, params).then(response => {
      LoggerUtils.log('_deliverOrder:: changeOrderStatus', 'data', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        this._refresh();
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('_deliverOrder:: changeOrderStatus error', 
          'errorCode', errorCode, 'params', JSON.stringify(params));
      }
    });
  }

  _handover = () => {
    const { orderDetail } = this.state;

    const hub = this._getCurrentHub(orderDetail);
    const hubCode = _.get(hub, 'code');
    const boxCode = _.get(hub, 'boxInfo.code');
    const orderCode = _.get(orderDetail, "orderCode");
    
    LoggerUtils.log('_handover', 'hubCode', hubCode, 
      'boxCode', boxCode, 'orderCode', orderCode,
        'orderDetail', JSON.stringify(orderDetail));
    
    HubService.handover(hubCode, boxCode, orderCode).then(response => {
      LoggerUtils.log('_handover:: handover', 'data', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        this._refresh();
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('_handover:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
      }
    });
  }

  render() {
    const { showStampScanner, showShelfScanner, showPayment } = this.state;
    LoggerUtils.log('render OrderDetail', 
      'showStampScanner', showStampScanner, 
      'showShelfScanner', showShelfScanner,
      'showPayment', showPayment);

    if(showStampScanner) {
      return this._renderStampScanner();
    }
    if(showShelfScanner) {
      return this._renderShelfScanner();
    }
    if(showPayment) {
      return this._renderPaymentScreen();
    }
    return this._renderMainScreen();
  }

  _renderStampScanner() {
    LoggerUtils.log('_renderStampScanner');
    const { qrData } = this.state;

    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={this._hideScanner}>
              <IconNB name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>1.Quét mã tem</Title>
          </Body>
          <Right style={{flex: 1}}>
            <Button transparent onPress={ () => this.refs.codeScanner.toggleTorch() }>
              <IconNB name="ios-flash" />
            </Button>
          </Right>
        </Header>

        <View style={{flex: 1}}>
          <View style={{flex: 1, overflow: 'hidden'}}>
            <CodeScanner ref="codeScanner"
              barcodeRecognized={this._barcodeRecognized}/>
          </View>
          <View>
            <View style={{
              // borderColor: 'red', 
              // borderWidth: 1
            }}>
              <Text style={{fontSize: 17, color: "#000", paddingTop: 5, paddingLeft: 5}}>2. Hoặc</Text>
            </View>
            <Form>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: 5,
                // borderColor: 'red',
                // borderWidth: 1,
              }}>
                <Item style={{flex : 1}}>
                  {/* <Text>ILG</Text> */}
                  <Input placeholder='Nhập mã tem'
                    onChangeText={text => this._updateValue("qrData", text)}>{qrData}</Input>
                </Item>
                <Item>
                  <Button onPress={this._assignStamp}>
                    <TextNB>Đồng ý</TextNB>
                  </Button>
                </Item>
              </View>
            </Form>
          </View>
        </View>
      </Container>
    );
  }

  _renderShelfScanner() {
    LoggerUtils.log('_renderShelfScanner');
    const { qrData } = this.state;

    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={this._hideScanner}>
              <IconNB name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>1.Quét mã kệ</Title>
          </Body>
          <Right style={{flex: 1}}>
            <Button transparent onPress={ () => this.refs.codeScanner.toggleTorch() }>
              <IconNB name="ios-flash" />
            </Button>
          </Right>
        </Header>

        <View style={{flex: 1}}>
          <View style={{flex: 1, overflow: 'hidden'}}>
            <CodeScanner ref="codeScanner"
              barcodeRecognized={this._barcodeRecognized}/>
          </View>
          <View>
            <View style={{
              // borderColor: 'red', 
              // borderWidth: 1
            }}>
              <Text style={{fontSize: 17, color: "#000", paddingTop: 5, paddingLeft: 5}}>2. Hoặc</Text>
            </View>
            <Form>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: 5,
                // borderColor: 'red',
                // borderWidth: 1,
              }}>
                <Item style={{flex : 1}}>
                  {/* <Text>ILG</Text> */}
                  <Input placeholder='Nhập mã kệ'
                    onChangeText={text => this._updateValue("qrData", text)}>{qrData}</Input>
                </Item>
                <Item>
                  <Button onPress={this._putIntoShelf}>
                    <TextNB>Đồng ý</TextNB>
                  </Button>
                </Item>
              </View>
            </Form>
          </View>
        </View>
      </Container>
    );
  }

  _renderFooter(orderDetail, canAcceptOrder, canHandover, deliverFlag) {
    const orderStatus = _.get(orderDetail, 'orderStatus');
    const { FO_DELIVERED, SO_DELIVERED, EO_DELIVERED } = ORDER_STATUSES;

    if(!_.includes([ FO_DELIVERED, SO_DELIVERED, EO_DELIVERED ], orderStatus)) {
      if(deliverFlag) {
        return (
          <Footer>
            <FooterTab>
                <Button full style={{ backgroundColor : '#051B49'}}
                  onPress={this._deliverOrder}>
                  <Title style={{ color: '#FFF' }}>Giao hàng</Title>
                </Button>  
            </FooterTab>
          </Footer>
        )
      }
      if(canAcceptOrder) {
        return (
          <Footer>
            <FooterTab>
                <Button full style={{ backgroundColor : '#051B49'}}
                  onPress={this._acceptOrder}>
                  <Title style={{ color: '#FFF' }}>Nhận hàng</Title>
                </Button>  
            </FooterTab>
          </Footer>
        )
      }
      if(canHandover) {
        return (
          <Footer>
            <FooterTab>
                <Button full style={{ backgroundColor : '#051B49'}}
                  onPress={this._handover}>
                  <Title style={{ color: '#FFF' }}>Bàn giao</Title>
                </Button>  
            </FooterTab>
          </Footer>
        )
      }
    }
  }

  _renderMainScreen() {
    const { refreshing, deliverFlag, orderDetail } = this.state;
    const { ACTION_SCAN_STAMP, ACTION_PUT_INTO_SHELF } = this.options;
    
    const canAssignStamp = this._canAssignStamp(orderDetail);
    const canPutIntoShelf = this._canPutIntoShelf(orderDetail);

    const canAcceptOrder = this._canAcceptOrder(orderDetail);
    const canHandover = this._canHandover(orderDetail);
    
    LoggerUtils.log('_renderMainScreen', 
      'canAssignStamp', canAssignStamp, 
        'canPutIntoShelf', canPutIntoShelf, 
          'canAcceptOrder', canAcceptOrder,
            'canHandover', canHandover,
              'deliverFlag', deliverFlag);

    const footer = this._renderFooter(orderDetail, canAcceptOrder, canHandover, deliverFlag);

    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => NavigationUtils.goBack(this.props.navigation)}>
              <IconNB name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>Chi tiết đơn hàng</Title>
          </Body>
          <Right style={{flex: 1}}>
            <Button transparent onPress={this._refresh} >
              <IconNB name="refresh" />
            </Button>
          </Right>
        </Header>
        <Content style={{ backgroundColor: "#FFF" }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>
          <View style={{flex: 1, padding: 10, }}>
            {/* Section 1 */}
            <View style={{
              flex: 1, 
              flexDirection: 'row',
              // borderColor: 'green',
              borderWidth: 1,
            }}>
              <View style={{
                flex: 1,
                // borderWidth: 1,
              }}>
                <Text>{`${_.get(orderDetail, 'orderCode')} - ${_.get(orderDetail, 'orderType')}`}</Text>
                <Text style={{marginTop: 10}}>{DateTimeUtils.toFullDateFormat(_.get(orderDetail, 'created'))}</Text>
              </View>
              
              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                // borderWidth: 1,
              }}>
                <View style={{
                  backgroundColor: 'blue',
                  padding: 12,
                  marginRight: 5
                }}></View>
                <View>
                  <Text>{_.get(orderDetail, 'orderStatus')}</Text>
                </View>
              </View>
            </View>

            {/* Section 2 */}
            <View style={{
              flexDirection: 'column',
              marginTop: 20,
              borderWidth: 1,
            }}>
              <View>
                <Text>{`From: ${_.get(orderDetail, 'pickupLocation.address')}`}</Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text>{_.get(orderDetail, 'pickupInfo.name')}</Text>
                  <Text>{_.get(orderDetail, 'pickupInfo.phoneNumber')}</Text>
                </View>
              </View>
              <View style={{
                alignItems: 'center'
              }}>
                <Text>|</Text>
                <Text>|</Text>
              </View>
              <View>
                <Text>{`To: ${_.get(orderDetail, 'dropOffLocation.address')}`}</Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text>{_.get(orderDetail, 'dropOffInfo.name')}</Text>
                  <Text>{_.get(orderDetail, 'dropOffInfo.phoneNumber')}</Text>
                </View>
              </View>
            </View>

            {/* Section 3 */}
            <View style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
              borderWidth: 1,
            }}>
              <View style={{
                flexDirection: 'column',
              }}>
                <View>
                  <Text>Mã Vận Đơn</Text>
                </View>
                <View>
                  <Text>{_.get(orderDetail, 'stampId')}</Text>
                </View>
              </View>
              { 
                canAssignStamp && (
                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <TouchableWithoutFeedback onPress={() => this._showScanner(ACTION_SCAN_STAMP) }>
                      <IconNB name="qr-scanner" color="#000" size={24} />
                    </TouchableWithoutFeedback>
                  </View> )
              }
            </View>

            {/* Section 4 */}
            <View style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
              borderWidth: 1,
            }}>
              <View style={{
                flexDirection: 'column',
              }}>
                <View>
                  <Text>Kệ</Text>
                </View>
                <View>
                  <Text>{_.get(this._getCurrentHub(orderDetail), 'boxInfo.code')}</Text>
                </View>
              </View>
              { 
                canPutIntoShelf && 
                (
                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <TouchableWithoutFeedback onPress={() => this._showScanner(ACTION_PUT_INTO_SHELF) }>
                      <IconNB name="qr-scanner" color="#000" size={24} />
                    </TouchableWithoutFeedback>
                  </View>
                )
              }
            </View>

            {/* Section 5 */}
            <View style={{
              flexDirection: 'column',
              marginTop: 20,
              borderWidth: 1,
            }}>
              <View>
                <Text>Hình ảnh</Text>
              </View>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 90,
                  height: 90,
                  borderWidth: 1,
                }}>
                  <Text>Chạm để chụp</Text>
                </View>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 90,
                  height: 90,
                  borderWidth: 1,
                }}>
                  <Text>Chạm để chụp</Text>
                </View>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 90,
                  height: 90,
                  borderWidth: 1,
                }}>
                  <Text>Chạm để chụp</Text>
                </View>
              </View>
            </View>
          </View>
        </Content>
        {footer}
      </Container>
    );
  }
}

// order detail response
// {
//   "success": true,
//   "data": {
//     "created": 1562041386000,
//     "updated": 1562041386000,
//     "id": 4643,
//     "orderCode": "ILG004643",
//     "orderStatus": "FO_SUBMITTED",
//     "orderType": "EXTERNAL_FO",
//     "goodsCategory": "FASHION",
//     "paymentType": "B2B",
//     "totalFee": 0,
//     "codAmount": 0,
//     "cashAdvancedAmount": 0,
//     "discount": 0,
//     "offerCode": null,
//     "preferredPickupTime": null,
//     "remark": null,
//     "route": "Quận 3 > Quận 1",
//     "pickupHubCode": "HQ3-01",
//     "pickupLocation": {
//       "id": 97,
//       "lat": 10.777473,
//       "lng": 106.691238,
//       "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//       "placeName": "iLogic SP-Võ Văn Tần",
//       "street": "Võ Văn Tần",
//       "level1": "Hồ Chí Minh",
//       "level2": "Quận 3"
//     },
//     "pickupInfo": {
//       "id": 602,
//       "name": "iLogic-DHL",
//       "phoneNumber": "0859876543"
//     },
//     "dropOffHubCode": "HQ1-02",
//     "dropOffLocation": {
//       "id": 95,
//       "lat": 10.788925,
//       "lng": 106.695975,
//       "address": "132-134 Điện Biên Phủ, phường Đa Kao, Quận 1, Hồ Chí Minh",
//       "placeName": "iLogic Box-Điện Biên Phủ",
//       "street": "Điện Biên Phủ",
//       "level1": "Hồ Chí Minh",
//       "level2": "Quận 1"
//     },
//     "dropOffInfo": {
//       "id": 589,
//       "name": "0938674470",
//       "phoneNumber": "0938674470"
//     },
//     "mileInfoId": null,
//     "mileUpdatedDate": null,
//     "assignee": "",
//     "assigneeRole": null,
//     "driverEarning": 0,
//     "provider": "iLogic-DHL",
//     "secretKey": "BDE8D2",
//     "shipmentCode": "VN-5-HOCH-3/VN-5-HOCH-1",
//     "orderFee": 0,
//     "shippingFee": 0,
//     "pickupAtBoxFee": 0,
//     "deliverToBoxFee": 0,
//     "codFee": 0,
//     "doorToDoorFee": 0,
//     "cashAdvancedFee": 0,
//     "handleWithCareFee": null,
//     "highValueFee": null,
//     "dangerousFee": null,
//     "smellingFee": null,
//     "vat": 0,
//     "iLogicEarning": 0,
//     "refundToCustomer": null,
//     "refundToDriver": null,
//     "collectedFromCustomer": 0,
//     "paidBySender": false,
//     "paidByReceiver": false,
//     "paidCodByReceiver": false,
//     "busDelivery": false,
//     "pickupHub": {
//       "id": 4,
//       "hubType": "HUB_MANUAL",
//       "code": "HQ3-01",
//       "name": "iLogic SP-Võ Văn Tần",
//       "image": "",
//       "phone": "",
//       "location": {
//         "id": 97,
//         "lat": 10.777473,
//         "lng": 106.691238,
//         "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//         "placeName": "iLogic SP-Võ Văn Tần",
//         "street": "Võ Văn Tần",
//         "level1": "Hồ Chí Minh",
//         "level2": "Quận 3"
//       },
//       "startWorkingHour": null,
//       "endWorkingHour": null,
//       "description": null,
//       "live": true,
//       "boxInfo": null
//     },
//     "dropOffHub": {
//       "id": 3,
//       "hubType": "HUB_AUTO",
//       "code": "HQ1-02",
//       "name": "iLogic Box-Điện Biên Phủ",
//       "image": "./asset/IMAGE/DienBienPhu.jpg",
//       "phone": "",
//       "location": {
//         "id": 95,
//         "lat": 10.788925,
//         "lng": 106.695975,
//         "address": "132-134 Điện Biên Phủ, phường Đa Kao, Quận 1, Hồ Chí Minh",
//         "placeName": "iLogic Box-Điện Biên Phủ",
//         "street": "Điện Biên Phủ",
//         "level1": "Hồ Chí Minh",
//         "level2": "Quận 1"
//       },
//       "startWorkingHour": null,
//       "endWorkingHour": null,
//       "description": null,
//       "live": true,
//       "boxInfo": null
//     },
//     "senderHubCode": "HQ3-01",
//     "senderLocation": {
//       "id": 97,
//       "lat": 10.777473,
//       "lng": 106.691238,
//       "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//       "placeName": "iLogic SP-Võ Văn Tần",
//       "street": "Võ Văn Tần",
//       "level1": "Hồ Chí Minh",
//       "level2": "Quận 3"
//     },
//     "senderInfo": {
//       "id": 602,
//       "name": "iLogic-DHL",
//       "phoneNumber": "0859876543"
//     },
//     "senderHub": {
//       "id": 4,
//       "hubType": "HUB_MANUAL",
//       "code": "HQ3-01",
//       "name": "iLogic SP-Võ Văn Tần",
//       "image": "",
//       "phone": "",
//       "location": {
//         "id": 97,
//         "lat": 10.777473,
//         "lng": 106.691238,
//         "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//         "placeName": "iLogic SP-Võ Văn Tần",
//         "street": "Võ Văn Tần",
//         "level1": "Hồ Chí Minh",
//         "level2": "Quận 3"
//       },
//       "startWorkingHour": null,
//       "endWorkingHour": null,
//       "description": null,
//       "live": true,
//       "boxInfo": null
//     },
//     "receiverHubCode": "HQ1-02",
//     "receiverLocation": {
//       "id": 95,
//       "lat": 10.788925,
//       "lng": 106.695975,
//       "address": "132-134 Điện Biên Phủ, phường Đa Kao, Quận 1, Hồ Chí Minh",
//       "placeName": "iLogic Box-Điện Biên Phủ",
//       "street": "Điện Biên Phủ",
//       "level1": "Hồ Chí Minh",
//       "level2": "Quận 1"
//     },
//     "receiverInfo": {
//       "id": 589,
//       "name": "0938674470",
//       "phoneNumber": "0938674470"
//     },
//     "receiverHub": {
//       "id": 3,
//       "hubType": "HUB_AUTO",
//       "code": "HQ1-02",
//       "name": "iLogic Box-Điện Biên Phủ",
//       "image": "./asset/IMAGE/DienBienPhu.jpg",
//       "phone": "",
//       "location": {
//         "id": 95,
//         "lat": 10.788925,
//         "lng": 106.695975,
//         "address": "132-134 Điện Biên Phủ, phường Đa Kao, Quận 1, Hồ Chí Minh",
//         "placeName": "iLogic Box-Điện Biên Phủ",
//         "street": "Điện Biên Phủ",
//         "level1": "Hồ Chí Minh",
//         "level2": "Quận 1"
//       },
//       "startWorkingHour": null,
//       "endWorkingHour": null,
//       "description": null,
//       "live": true,
//       "boxInfo": null
//     },
//     "deliveryLocation": null,
//     "deliveryHub": null,
//     "blackList": null,
//     "customerService": "",
//     "parcels": [
//       {
//         "id": 4648,
//         "category": "FASHION",
//         "size": "SMALL_SIZED",
//         "weight": null,
//         "dRealSize": null,
//         "rRealSize": null,
//         "cRealSize": null,
//         "realWeight": null,
//         "highValue": false,
//         "handleWithCare": false,
//         "dangerous": false,
//         "smelling": false,
//         "group": "NORMAL",
//         "dsize": null,
//         "rsize": null,
//         "csize": null
//       }
//     ],
//     "internalNote": null,
//     "createdDate": 1562041386000,
//     "updatedDate": 1562041386000,
//     "updatedBy": null,
//     "deliveredDate": null,
//     "images": [],
//     "evidenceImages": [],
//     "lockerImages": [],
//     "signatureImages": [],
//     "stampId": null,
//     "estimatedDistance": 0,
//     "mileType": null,
//     "partner": "iLogic-DHL",
//     "partnerWaybill": "1435465788iLogic",
//     "boxes": []
//   }
// }



// handover response
// {
//   "success": true,
//   "data": {
//     "id": 19,
//     "code": "C01",
//     "boxSize": "B_LARGE",
//     "orderCodes": [
//       {
//         "orderCode": "ILG002954",
//         "parcelDimension": "LARGE_SIZED",
//         "boxGoodStatus": "SOMETHING",
//         "orderStatus": null,
//         "token": null
//       },
//       {
//         "orderCode": "ILG003050",
//         "parcelDimension": "MEDIUM_SIZED",
//         "boxGoodStatus": "SOMETHING",
//         "orderStatus": null,
//         "token": null
//       },
//       {
//         "orderCode": "ILG004194",
//         "parcelDimension": "LARGE_SIZED",
//         "boxGoodStatus": "SOMETHING",
//         "orderStatus": null,
//         "token": null
//       },
//       {
//         "orderCode": "ILG004706",
//         "parcelDimension": "SMALL_SIZED",
//         "boxGoodStatus": "SOMETHING",
//         "orderStatus": null,
//         "token": null
//       },
//       {
//         "orderCode": "ILG004792",
//         "parcelDimension": "SMALL_SIZED",
//         "boxGoodStatus": "SOMETHING",
//         "orderStatus": null,
//         "token": null
//       },
//       {
//         "orderCode": "ILG004796",
//         "parcelDimension": "SMALL_SIZED",
//         "boxGoodStatus": "SOMETHING",
//         "orderStatus": null,
//         "token": null
//       }
//     ],
//     "boxGoodsStatus": "SOMETHING",
//     "boxOpenStatus": "CLOSE",
//     "driverBooard": "B-VO VAN TAN",
//     "updated": 1561961977000
//   }
// }