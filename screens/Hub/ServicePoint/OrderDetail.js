import React, { Component } from "react";

import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert, Vibration } from "react-native";

import { Container, Header, Title, Subtitle, Content, Item, Form, 
  Text as TextNB, Input, Button, Icon as IconNB, Left, Right, Body, Footer, FooterTab, Badge, H3 } from "native-base";

import _ from 'lodash';

import CodeScanner from '../components/CodeScanner';

import { DateTimeUtils, LoggerUtils } from '../utils/Utils';
import OrderService from '../services/OrderService';

export default class App extends Component {

  constructor(props) {
    super(props);
    
    const { navigation } = props;
    const orderCode = navigation.getParam('orderCode', '');

    LoggerUtils.log('init OrderDetail', 'orderCode', orderCode);

    this.state = {
      orderCode,
      showScanner: false,
      qrData: '',
      // orderDetail: {}
    };
  }
  
  componentDidMount() {
    LoggerUtils.log('componentDidMount OrderDetail');
    this._refresh();
  }

  _barcodeRecognized = (barcodes) => {
    const firstCode  = barcodes[0];
    const { data } = firstCode;

    LoggerUtils.log('_barcodeRecognized', 'data', data);
    this.setState({qrData: data});
  }

  _showScanner = () => {
    LoggerUtils.log('_showScanner');
    const self = this;
    // debug code start
    OrderService.getAvailableStamp(function(stampId) {
      LoggerUtils.log('getAvailableStamp', 'stampId', stampId);
      self.setState({ showScanner: true, qrData: stampId });
    });
    // debug code end

    // this.setState({ showScanner: true, qrData: '' });
  }

  _hideScanner = () => {
    LoggerUtils.log('_hideScanner');
    this.setState({ showScanner: false, scanAction: '' });
  }

  _assignStamp = () => {
    const { orderCode, qrData } = this.state;
    LoggerUtils.log('_assignStamp', 'orderCode', orderCode, 'stamp', qrData);

    OrderService.assignStamp(orderCode, qrData).then(response => {
      this._refresh();
    });

    this._hideScanner();
  }

  _renderScanner = () => {
    LoggerUtils.log('_renderScanner');
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
            <Title style={{color: "#FFF"}}>1.Quét mã QR</Title>
          </Body>
          <Right style={{flex: 1}}>
          </Right>
        </Header>

        <View style={{flex: 1}}>
          <View style={{flex: 1, overflow: 'hidden'}}>
            <CodeScanner barcodeRecognized={this._barcodeRecognized}/>
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
                  <Input placeholder='Nhập mã tem'>{qrData}</Input>
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

  _refresh = () => {
    const { orderCode } = this.state;
    LoggerUtils.log('_refresh', 'orderCode', orderCode);
    OrderService.orderDetailByOrderCode(orderCode).then(response => {
      const orderDetail = response.data.data;
      LoggerUtils.log('orderDetailByOrderCode', 'orderDetail', JSON.stringify(orderDetail));
      this.setState({ orderDetail });
    });
  }

  _acceptOrder = () => {
    const { orderDetail } = this.state;
    const orderCode = _.get(orderDetail, "orderCode");
    const hubCode = _.get(orderDetail, "pickupHub.code");
    
    LoggerUtils.log('_acceptOrder', 'orderCode', orderCode, 'hubCode', hubCode);
    OrderService.atHub(orderCode, hubCode);
  }

  _renderMainScreen = () => {
    LoggerUtils.log('_renderMainScreen');

    const { orderDetail } = this.state;

    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
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
        <Content style={{ backgroundColor: "#FFF" }}>
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
                (_.get(orderDetail, 'stampId') == null || _.get(orderDetail, 'stampId') == '' || _.get(orderDetail, 'stampId') == undefined)
                && (
                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <TouchableWithoutFeedback onPress={this._showScanner}>
                      <IconNB name="qr-scanner" color="#000" size={24} />
                    </TouchableWithoutFeedback>
                  </View>
                )
              }
              
            </View>

            {/* Section 4 */}
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
        <Footer>
          <FooterTab>
            <Button full style={{ backgroundColor : '#051B49'}}
              onPress={this._acceptOrder}>
              <Title style={{ color: '#FFF' }}>Nhận hàng</Title>
            </Button>  
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  render() {
    const { showScanner } = this.state;
    LoggerUtils.log('render OrderDetail', 'showScanner', showScanner);
    if(showScanner) {
      return this._renderScanner();
    }
    
    return this._renderMainScreen();
  }
}


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