import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback,
  ActivityIndicator, RefreshControl } from "react-native";

import { Container, Header, Title, Subtitle, Content, Button, Icon as IconNB, Left, Right, Body,
  Form, Item, Text as TextNB, Input, Tabs, Tab, Footer, FooterTab } from "native-base";

import _ from 'lodash';

import { NavigationUtils, LoggerUtils } from '../utils/Utils';

import masterStore from '../store/MasterStore';

import CodeScanner from '../components/CodeScanner';

import OrderService from '../services/OrderService';
import HubService from './../services/HubService';

import { ORDER_STATUSES, ORDER_TYPES } from '../utils/Constants';

export default class App extends Component {

  constructor(props) {
    super(props);
    
    const { navigation } = props;
    const hub = navigation.getParam('hub', '');
    const driverCode = navigation.getParam('driverCode', '');

    LoggerUtils.log('init DriverOrders', 'hub', JSON.stringify(hub), 'driverCode', driverCode);

    this.state = {
      refreshing: false,
      hub,
      driverCode,
      showMutualCheckScanner: false,
      qrData: 'ILG004812',
      // inbound: {},
      // outbound: {},
      mutualCheckInboundOrders: {},
    };

    const ACTION_MUTUAL_CHECK = "ACTION_MUTUAL_CHECK";

    this.options = {
      ACTION_MUTUAL_CHECK,
    }
  }

  componentDidMount() {
    LoggerUtils.log('componentDidMount DriverOrders');
    this._refresh();
  }

  _refresh = () => {
    this.setState({ refreshing: true });
    const { hub, driverCode } = this.state;
    const hubCode = _.get(hub, 'code');
    LoggerUtils.log('_refresh DriverOrders', 'hubCode', hubCode, 'driverCode', driverCode);
    
    OrderService.inboundOutboundOrders(hubCode, driverCode).then(response => {
      LoggerUtils.log('inboundOutboundOrders', 'response', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        const data = _.get(response, 'data.data');
        const inbound = _.get(data, 'HUB_INBOUND');
        const outbound = _.get(data, 'HUB_OUTBOUND');
        this.setState({ inbound, outbound, refreshing: false });
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('inboundOutboundOrders:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
        this.setState({ refreshing: false });
      }
    });
  }

  _onItemClicked = ({ orderCode }) => {
    LoggerUtils.log('_onItemClicked', 'orderCode', orderCode);
    const { navigation } = this.props;
    NavigationUtils.navigateToOrderDetailScreen(navigation, orderCode);
  }

  onRefresh() {
    LoggerUtils.log("onRefresh DriverOrders");
    this._refresh();
  }

  _hideScanner = () => {
    LoggerUtils.log('_hideScanner');
    this.setState({ showMutualCheckScanner: false, qrData: '' });
  }

  _showScanner = (action) => {
    const { ACTION_MUTUAL_CHECK } = this.options;
    
    LoggerUtils.log('_showScanner', 'action', action);

    switch(action) {
      case ACTION_MUTUAL_CHECK: 
        this.setState({ showMutualCheckScanner: true });
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

  _mutualCheck = () => {
    const { inbound, qrData } = this.state;
    let { mutualCheckInboundOrders } = this.state;
    
    const inboundOrders = _.get(inbound, 'orderList');
    
    const orderCode = qrData;

    LoggerUtils.log('_mutualCheck', 'orderCode', orderCode);
    if(orderCode != undefined && orderCode != '') {
      const order = _.find(inboundOrders, {orderCode: orderCode});
      
      if(order != undefined && order != null) {
        mutualCheckInboundOrders = { ...mutualCheckInboundOrders };
        let status = _.get(mutualCheckInboundOrders, orderCode);
  
        if(status == undefined || status == null) {
          status = {
            order: order
          };
          mutualCheckInboundOrders[orderCode] = status;
        }
        status['mutualCheckStatus'] = true;

        LoggerUtils.log('_mutualCheck', 'orderCode', orderCode, 
          'mutualCheckInboundOrders', JSON.stringify(mutualCheckInboundOrders), 
          'order', JSON.stringify(order));
        this.setState({ mutualCheckInboundOrders });
        this._hideScanner();
      } else {
        LoggerUtils.log('_mutualCheck notFoundOrder', 'orderCode', orderCode);
      }

    }
  }

  _accpeptOrders = () => {
    const { FO, SO, EO } = ORDER_TYPES;
    const { FO_AT_HUB_FOR_COLLECTION } = ORDER_STATUSES;

    let { hub, mutualCheckInboundOrders } = this.state;
    const hubCode = _.get(hub, 'code');
    
    const lat = _.get(hub, 'location.lat');
    const lng = _.get(hub, 'location.lng');
    
    const orderList = [];

    mutualCheckInboundOrders = {...mutualCheckInboundOrders};
    Object.keys(mutualCheckInboundOrders).forEach(orderCode => {
      LoggerUtils.log('temp', JSON.stringify(orderCode));
      const item = _.get(mutualCheckInboundOrders, orderCode);
      const mutualCheckStatus = _.get(item, 'mutualCheckStatus');
      if(mutualCheckStatus == true) {
        const orderType = _.get(item, 'order.orderType');
        let orderStatus = "";
        switch(orderType) {
          case FO: 
            orderStatus = FO_AT_HUB_FOR_COLLECTION;
            break;
          default:
            break;
        }
        orderList.push({
          orderCode: orderCode,
          orderStatus: orderStatus,
        });
        item['acceptOrderStatus'] = true;
      }
    });

    const data = {
      "orderList": orderList,
      "hubCode": hubCode,
      "lat": lat,
      "lng": lng,
    };

    LoggerUtils.log('_accpeptOrders', 
      'mutualCheckInboundOrders', JSON.stringify(mutualCheckInboundOrders),
      'data', JSON.stringify(data),
    );

    if(orderList.length > 0) {
      HubService.acceptOrders(data).then(response => {
        // {
        //   "success": true,
        //   "data": [
        //     {
        //       "orderCode": "ILG004812",
        //       "orderStatus": "FO_AT_HUB_FOR_COLLECTION",
        //       "errorCode": ""
        //     }
        //   ]
        // }
        LoggerUtils.log('acceptOrders', 'response', JSON.stringify(response));
        if(_.get(response, 'data.success') == true) {
          this.setState({ mutualCheckInboundOrders });
        } else {
          const data = _.get(response, 'data.data');
          const errorCode = _.get(data, 'errorCode');
          const params = _.get(data, 'params');
          LoggerUtils.log('acceptOrders:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
        }
      });
    }
  }

  _renderMutualCheckScanner() {
    LoggerUtils.log('_renderMutualCheckScanner');
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
            <Title style={{color: "#FFF"}}>1.Quét mã đơn hàng</Title>
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
                  <Input placeholder='Nhập mã đơn hàng'
                    onChangeText={text => this._updateValue("qrData", text)}>{qrData}</Input>
                </Item>
                <Item>
                  <Button onPress={this._mutualCheck}>
                    <TextNB>Đồng kiểm</TextNB>
                  </Button>
                </Item>
              </View>
            </Form>
          </View>
        </View>
      </Container>
    );
  }

  _renderInboundListItem = (item) => {
    const { mutualCheckInboundOrders } = this.state;
    const orderCode = _.get(item, 'orderCode');

    const mutualCheckStatus = _.get(mutualCheckInboundOrders, `${orderCode}.mutualCheckStatus`);
    const acceptOrderStatus = _.get(mutualCheckInboundOrders, `${orderCode}.acceptOrderStatus`);
    
    let mutualCheckStatusString = "Chưa đồng kiểm";
    if(mutualCheckStatus == true) {
      mutualCheckStatusString = "Đã đồng kiểm";
    }

    let acceptOrderStatusString = "Chưa nhận hàng";
    if(acceptOrderStatus == true) {
      acceptOrderStatusString = "Đã nhận hàng";
    }
    
    LoggerUtils.log('_renderInboundListItem', 'orderCode', orderCode,
      'mutualCheckStatus', mutualCheckStatus, 'acceptOrderStatus', acceptOrderStatus);

    return (
      <TouchableWithoutFeedback onPress={() => this._onItemClicked(item)}>
        <View style={{ 
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#FFFFFF",
          paddingVertical: 6,
        }} >
          <View style={{ 
            flex: 1,
            justifyContent: "center",
            // backgroundColor: "yellow",
          }} >
            <Text>Mã Đơn Hàng</Text>
            <Text>{`#${_.get(item, "orderCode")}`}</Text>
            <Text>{`${mutualCheckStatusString}`}</Text>
          </View>
          <View style={{ 
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 10,
            // backgroundColor: "blue",
          }} >
            <Text>Trạng Thái</Text>
            <Text>{`${_.get(item, "orderStatus")}`}</Text>
            <Text>{`${acceptOrderStatusString}`}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  _renderInboundList = (orders) => {
    const length = _.get(orders, 'length');
    LoggerUtils.log('_renderInboundList', 'length', length);
    
    if(length != undefined && length <= 0) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text>Không tìm thấy dữ liệu</Text>
        </View>
      );
    }
    
    const { refreshing } = this.state;
    return (
      <View style={{flex: 1}}>
        <FlatList contentContainerStyle={{margin: 16, backgroundColor: '#FFFFFF'}}
          data={orders}
          ItemSeparatorComponent={() => (
            <View style={{ 
              height: 0.5,
              backgroundColor: "#DCE1E5",
              marginHorizontal: 16
            }} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          keyExtractor={(item, index) => item.orderCode.toString()}
          renderItem={({ item, index }) => this._renderInboundListItem(item)}
        />
      </View>
    );
  }

  _renderOutboundList = (orders) => {
    const length = _.get(orders, 'length');
    LoggerUtils.log('_renderOutboundList', 'length', length);

    if(length != undefined && length <= 0) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text>Không tìm thấy dữ liệu</Text>
        </View>
      );
    }
    
    const { refreshing } = this.state;
    return (
      <View style={{flex: 1}}>
        <FlatList contentContainerStyle={{margin: 16, backgroundColor: '#FFFFFF'}}
          data={orders}
          ItemSeparatorComponent={() => (
            <View style={{ 
              height: 0.5,
              backgroundColor: "#DCE1E5",
              marginHorizontal: 16
            }} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          keyExtractor={(item, index) => item.orderCode.toString()}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback onPress={() => this._onItemClicked(item)}>
              <View style={{ 
                flex: 1,
                flexDirection: "row",
                backgroundColor: "#FFFFFF",
                paddingVertical: 6,
              }} >
                <View style={{ 
                  flex: 1,
                  justifyContent: "center",
                  // backgroundColor: "yellow",
                }} >
                  <Text>Mã Đơn Hàng</Text>
                  <Text>{`#${_.get(item, "orderCode")}`}</Text>
                </View>
                <View style={{ 
                  flex: 1,
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  // backgroundColor: "blue",
                }} >
                  <Text>Trạng Thái</Text>
                  <Text>{`${_.get(item, "orderStatus")}`}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      </View>
    );
  }
  
  _renderMainScreen() {
    LoggerUtils.log('_renderMainScreen');
    const { navigation } = this.props;
    const { ACTION_MUTUAL_CHECK } = this.options;

    const { inbound, outbound } = this.state;
    const inboundOrders = _.get(inbound, 'orderList');
    let inboundOrderSize = _.get(inboundOrders, 'length');
    if(inboundOrderSize == undefined) {
      inboundOrderSize = 0;
    }

    const outboundOrders = _.get(outbound, 'orderList');
    let outboundOrderSize = _.get(outboundOrders, 'length');
    if(outboundOrderSize == undefined) {
      outboundOrderSize = 0;
    }

    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => NavigationUtils.goBack(navigation)}>
              <IconNB name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>Tài Xế</Title>
          </Body>
          <Right style={{flex: 1}}>
            <Button transparent onPress={this._refresh} >
              <IconNB name="refresh" />
            </Button>
          </Right>
        </Header>
        <Tabs>
          <Tab heading={`Hàng vào (${inboundOrderSize})`}>
            {this._renderInboundList(inboundOrders)}
            <Footer transparent>
              <FooterTab transparent>
                  <Button full warning
                    onPress={() => this._showScanner(ACTION_MUTUAL_CHECK)}>
                    <Title style={{ color: '#FFF' }}>Đồng kiểm</Title>
                  </Button>
                  <Button full primary
                    onPress={this._accpeptOrders}>
                    <Title style={{ color: '#FFF' }}>Nhận hàng</Title>
                  </Button>  
              </FooterTab>
            </Footer>
          </Tab>
          <Tab heading={`Hàng ra (${outboundOrderSize})`}>
            {this._renderOutboundList(outboundOrders)}
          </Tab>
        </Tabs>
      </Container>
    );
  }

  render() {
    const { showMutualCheckScanner } = this.state;
    LoggerUtils.log('render DriverOrders', 
      'showMutualCheckScanner', showMutualCheckScanner);

    if(showMutualCheckScanner) {
      return this._renderMutualCheckScanner();
    }
    
    return this._renderMainScreen();
  }

}

// {
//   "success": true,
//   "data": {
//       "HUB_OUTBOUND": {
//           "hubCode": "HQ3-01",
//           "driverCode": "ILG1809019",
//           "orderList": [
//               {
//                   "created": 1562215266000,
//                   "updated": 1562229654000,
//                   "id": 4702,
//                   "orderCode": "ILG004702",
//                   "orderStatus": "FO_ACCEPTED",
//                   "orderType": "EXTERNAL_FO",
//                   "goodsCategory": "FASHION",
//                   "paymentType": "B2B",
//                   "totalFee": 0,
//                   "codAmount": 0,
//                   "cashAdvancedAmount": 0,
//                   "discount": 0,
//                   "offerCode": null,
//                   "preferredPickupTime": null,
//                   "remark": null,
//                   "route": "Quận 3 > Quận 1",
//                   "pickupHubCode": "HQ3-01",
//                   "pickupLocation": {
//                       "id": 97,
//                       "lat": 10.777473,
//                       "lng": 106.691238,
//                       "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//                       "placeName": "iLogic SP-Võ Văn Tần",
//                       "street": "Võ Văn Tần",
//                       "level1": "Hồ Chí Minh",
//                       "level2": "Quận 3"
//                   },
//                   "pickupInfo": {
//                       "id": 602,
//                       "name": "iLogic-DHL",
//                       "phoneNumber": "0859876543"
//                   },
//                   "dropOffHubCode": "HQ1-02",
//                   "dropOffLocation": {
//                       "id": 95,
//                       "lat": 10.788925,
//                       "lng": 106.695975,
//                       "address": "132-134 Điện Biên Phủ, phường Đa Kao, Quận 1, Hồ Chí Minh",
//                       "placeName": "iLogic Box-Điện Biên Phủ",
//                       "street": "Điện Biên Phủ",
//                       "level1": "Hồ Chí Minh",
//                       "level2": "Quận 1"
//                   },
//                   "dropOffInfo": {
//                       "id": 589,
//                       "name": "0938674470",
//                       "phoneNumber": "0938674470"
//                   },
//                   "mileInfoId": null,
//                   "mileUpdatedDate": null,
//                   "assignee": "0856618882",
//                   "assigneeRole": "ROLE_DRIVER_STAFF",
//                   "driverEarning": 0,
//                   "provider": "iLogic-DHL",
//                   "secretKey": null,
//                   "shipmentCode": "VN-5-HOCH-3/VN-5-HOCH-1",
//                   "orderFee": 0,
//                   "shippingFee": 0,
//                   "pickupAtBoxFee": 0,
//                   "deliverToBoxFee": 0,
//                   "codFee": 0,
//                   "doorToDoorFee": 0,
//                   "cashAdvancedFee": 0,
//                   "handleWithCareFee": null,
//                   "highValueFee": null,
//                   "dangerousFee": null,
//                   "smellingFee": null,
//                   "vat": 0,
//                   "iLogicEarning": 0,
//                   "refundToCustomer": null,
//                   "refundToDriver": null,
//                   "collectedFromCustomer": 0,
//                   "paidBySender": false,
//                   "paidByReceiver": false,
//                   "paidCodByReceiver": false,
//                   "busDelivery": false,
//                   "pickupHub": null,
//                   "dropOffHub": null,
//                   "senderHubCode": "HQ3-01",
//                   "senderLocation": {
//                       "id": 97,
//                       "lat": 10.777473,
//                       "lng": 106.691238,
//                       "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//                       "placeName": "iLogic SP-Võ Văn Tần",
//                       "street": "Võ Văn Tần",
//                       "level1": "Hồ Chí Minh",
//                       "level2": "Quận 3"
//                   },
//                   "senderInfo": {
//                       "id": 602,
//                       "name": "iLogic-DHL",
//                       "phoneNumber": "0859876543"
//                   },
//                   "senderHub": null,
//                   "receiverHubCode": "HQ1-02",
//                   "receiverLocation": {
//                       "id": 95,
//                       "lat": 10.788925,
//                       "lng": 106.695975,
//                       "address": "132-134 Điện Biên Phủ, phường Đa Kao, Quận 1, Hồ Chí Minh",
//                       "placeName": "iLogic Box-Điện Biên Phủ",
//                       "street": "Điện Biên Phủ",
//                       "level1": "Hồ Chí Minh",
//                       "level2": "Quận 1"
//                   },
//                   "receiverInfo": {
//                       "id": 589,
//                       "name": "0938674470",
//                       "phoneNumber": "0938674470"
//                   },
//                   "receiverHub": null,
//                   "deliveryLocation": null,
//                   "deliveryHub": null,
//                   "blackList": null,
//                   "customerService": "",
//                   "parcels": [
//                       {
//                           "id": 4707,
//                           "category": "FASHION",
//                           "size": "SMALL_SIZED",
//                           "weight": null,
//                           "dRealSize": null,
//                           "rRealSize": null,
//                           "cRealSize": null,
//                           "realWeight": null,
//                           "highValue": false,
//                           "handleWithCare": false,
//                           "dangerous": false,
//                           "smelling": false,
//                           "group": "NORMAL",
//                           "dsize": null,
//                           "rsize": null,
//                           "csize": null
//                       }
//                   ],
//                   "internalNote": null,
//                   "createdDate": 1562215266000,
//                   "updatedDate": 1562229654000,
//                   "updatedBy": "0856618882",
//                   "deliveredDate": null,
//                   "images": [],
//                   "evidenceImages": [],
//                   "lockerImages": [],
//                   "signatureImages": [],
//                   "stampId": null,
//                   "estimatedDistance": 0,
//                   "mileType": null,
//                   "partner": "iLogic-DHL",
//                   "partnerWaybill": "1435465788iLogic",
//                   "boxes": null
//               }
//           ]
//       },
//       "HUB_INBOUND": {
//           "hubCode": "HQ3-01",
//           "driverCode": "ILG1809019",
//           "orderList": [
//               {
//                   "created": 1562211856000,
//                   "updated": 1562212020000,
//                   "id": 4693,
//                   "orderCode": "ILG004693",
//                   "orderStatus": "FO_IN_DELIVERY",
//                   "orderType": "FO",
//                   "goodsCategory": "FASHION",
//                   "paymentType": "CASH",
//                   "totalFee": 15000,
//                   "codAmount": 0,
//                   "cashAdvancedAmount": 0,
//                   "discount": 0,
//                   "offerCode": null,
//                   "preferredPickupTime": null,
//                   "remark": "",
//                   "route": "Quận 1 > Quận 3",
//                   "pickupHubCode": "",
//                   "pickupLocation": {
//                       "id": 871,
//                       "lat": 10.7691408,
//                       "lng": 106.7041218,
//                       "address": "8 Võ Văn Kiệt, Phường Nguyễn Thái Bình, Quận 1, Hồ Chí Minh, Việt Nam",
//                       "placeName": "",
//                       "street": "Võ Văn Kiệt",
//                       "level1": "Hồ Chí Minh",
//                       "level2": "Quận 1"
//                   },
//                   "pickupInfo": {
//                       "id": 17,
//                       "name": "huy",
//                       "phoneNumber": "0934020930"
//                   },
//                   "dropOffHubCode": "HQ3-01",
//                   "dropOffLocation": {
//                       "id": 97,
//                       "lat": 10.777473,
//                       "lng": 106.691238,
//                       "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//                       "placeName": "iLogic SP-Võ Văn Tần",
//                       "street": "Võ Văn Tần",
//                       "level1": "Hồ Chí Minh",
//                       "level2": "Quận 3"
//                   },
//                   "dropOffInfo": {
//                       "id": 462,
//                       "name": " Huy",
//                       "phoneNumber": "0934020930"
//                   },
//                   "mileInfoId": null,
//                   "mileUpdatedDate": null,
//                   "assignee": "0856618882",
//                   "assigneeRole": "ROLE_DRIVER_STAFF",
//                   "driverEarning": 12000,
//                   "provider": null,
//                   "secretKey": null,
//                   "shipmentCode": "VN-5-HOCH-1/VN-5-HOCH-3",
//                   "orderFee": 15000,
//                   "shippingFee": 15000,
//                   "pickupAtBoxFee": 0,
//                   "deliverToBoxFee": 0,
//                   "codFee": 0,
//                   "doorToDoorFee": 0,
//                   "cashAdvancedFee": 0,
//                   "handleWithCareFee": null,
//                   "highValueFee": null,
//                   "dangerousFee": null,
//                   "smellingFee": null,
//                   "vat": 1363,
//                   "iLogicEarning": 1637,
//                   "refundToCustomer": null,
//                   "refundToDriver": null,
//                   "collectedFromCustomer": 15000,
//                   "paidBySender": true,
//                   "paidByReceiver": false,
//                   "paidCodByReceiver": false,
//                   "busDelivery": false,
//                   "pickupHub": null,
//                   "dropOffHub": null,
//                   "senderHubCode": "",
//                   "senderLocation": {
//                       "id": 871,
//                       "lat": 10.7691408,
//                       "lng": 106.7041218,
//                       "address": "8 Võ Văn Kiệt, Phường Nguyễn Thái Bình, Quận 1, Hồ Chí Minh, Việt Nam",
//                       "placeName": "",
//                       "street": "Võ Văn Kiệt",
//                       "level1": "Hồ Chí Minh",
//                       "level2": "Quận 1"
//                   },
//                   "senderInfo": {
//                       "id": 17,
//                       "name": "huy",
//                       "phoneNumber": "0934020930"
//                   },
//                   "senderHub": null,
//                   "receiverHubCode": "HQ3-01",
//                   "receiverLocation": {
//                       "id": 97,
//                       "lat": 10.777473,
//                       "lng": 106.691238,
//                       "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//                       "placeName": "iLogic SP-Võ Văn Tần",
//                       "street": "Võ Văn Tần",
//                       "level1": "Hồ Chí Minh",
//                       "level2": "Quận 3"
//                   },
//                   "receiverInfo": {
//                       "id": 462,
//                       "name": " Huy",
//                       "phoneNumber": "0934020930"
//                   },
//                   "receiverHub": null,
//                   "deliveryLocation": null,
//                   "deliveryHub": null,
//                   "blackList": null,
//                   "customerService": "",
//                   "parcels": [
//                       {
//                           "id": 4698,
//                           "category": "FASHION",
//                           "size": "SMALL_SIZED",
//                           "weight": null,
//                           "dRealSize": null,
//                           "rRealSize": null,
//                           "cRealSize": null,
//                           "realWeight": null,
//                           "highValue": false,
//                           "handleWithCare": false,
//                           "dangerous": false,
//                           "smelling": false,
//                           "group": "NORMAL",
//                           "dsize": 0,
//                           "rsize": 0,
//                           "csize": 0
//                       }
//                   ],
//                   "internalNote": null,
//                   "createdDate": 1562211856000,
//                   "updatedDate": 1562212020000,
//                   "updatedBy": "0856618882",
//                   "deliveredDate": null,
//                   "images": [],
//                   "evidenceImages": [],
//                   "lockerImages": [],
//                   "signatureImages": [],
//                   "stampId": null,
//                   "estimatedDistance": 2411,
//                   "mileType": null,
//                   "partner": null,
//                   "partnerWaybill": null,
//                   "boxes": null
//               }
//           ]
//       }
//   }
// }