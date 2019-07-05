import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback,
  ActivityIndicator, RefreshControl } from "react-native";

import { Container, Header, Title, Subtitle, Content, Button, Icon as IconNB, Left, Right, Body,
  Tabs, Tab } from "native-base";

import _ from 'lodash';

import { NavigationUtils, LoggerUtils } from '../utils/Utils';

import OrderService from '../services/OrderService';

export default class App extends Component {

  constructor(props) {
    super(props);
    
    const { navigation } = props;
    const hubCode = navigation.getParam('hubCode', '');
    const driverCode = navigation.getParam('driverCode', '');

    LoggerUtils.log('init Driver Orders', 'hubCode', hubCode, 'driverCode', driverCode);

    this.state = {
      refreshing: false,
      hubCode,
      driverCode,
      // inbound: {},
      // outbound: {},
    };
  }

  componentDidMount() {
    LoggerUtils.log('componentDidMount Driver Orders');
    this._refresh();
  }

  _refresh = () => {
    this.setState({ refreshing: true });
    const { hubCode, driverCode } = this.state;
    LoggerUtils.log('_refresh Driver Orders', 'hubCode', hubCode, 'driverCode', driverCode);
    
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
  
  _renderTab = (header, orders) => {
    return (
      <Tab heading={header}>
        {this._renderList(orders)}
      </Tab>
    );
  }

  onRefresh() {
    LoggerUtils.log("onRefresh Driver Orders");
    this._refresh();
  }

  _renderList = (orders) => {
    const length = _.get(orders, 'length');
    
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

  render() {
    LoggerUtils.log('render Driver Orders');
    const { navigation } = this.props;
    const { inbound, outbound } = this.state;
    const inboundOrders = _.get(inbound, 'orderList');
    const outboundOrders = _.get(outbound, 'orderList');

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
        {/* <Content style={{ backgroundColor: "#E3E8EB" }}> */}
          <Tabs>
            { this._renderTab(`Hàng vào (${_.get(inboundOrders, 'length')})`, inboundOrders) }
            { this._renderTab(`Hàng ra (${_.get(outboundOrders, 'length')})`, outboundOrders) }
          </Tabs>
        {/* </Content> */}
      </Container>
    );
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