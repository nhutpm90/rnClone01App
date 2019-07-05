import React, { Component } from "react";

import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert, Vibration } from "react-native";

import { Container, Header, Title, Subtitle, Content, Item, Form, 
  Text as TextNB, Input, Button, Icon as IconNB, Left, Right, Body, Footer, FooterTab, Badge, H3, ActionSheet } from "native-base";

import _ from 'lodash';

import CodeScanner from '../components/CodeScanner';

import { DateTimeUtils, LoggerUtils, NavigationUtils } from '../utils/Utils';
import OrderService from '../services/OrderService';
import HubService from '../services/HubService';

import { ORDER_STATUSES } from '../utils/Constants';
export default class App extends Component {

  constructor(props) {
    super(props);
    
    const { navigation } = props;
    const orderCode = navigation.getParam('orderCode', '');

    LoggerUtils.log('init OrderDetail', 'orderCode', orderCode);

    this.state = {
      orderCode,
      showStampScanner: false,
      showShelfScanner: false,
      qrData: '',
      // orderDetail: {}
    };

    const ACTION_SCAN_STAMP = "ACTION_SCAN_STAMP";
    const ACTION_PUT_INTO_SHELF = "ACTION_PUT_INTO_SHELF";

    this.options = {
      ACTION_SCAN_STAMP, 
      ACTION_PUT_INTO_SHELF,
    }
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
    const { FO_SUBMITTED, SO_SUBMITTED, EO_SUBMITTED } = ORDER_STATUSES;
    
    const boxCode = _.get(orderDetail, 'pickupHub.boxInfo.code');
    const orderStatus = _.get(orderDetail, 'orderStatus');

    const result = (boxCode == null || boxCode == '' || boxCode == undefined)
          && !_.includes([ FO_SUBMITTED, SO_SUBMITTED, EO_SUBMITTED ], orderStatus);

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

  _refresh = () => {
    const { orderCode } = this.state;
    LoggerUtils.log('_refresh', 'orderCode', orderCode);
    OrderService.orderDetailByOrderCode(orderCode).then(response => {
      LoggerUtils.log('orderDetailByOrderCode', 'orderCode', orderCode, 'data', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        const orderDetail = _.get(response, 'data.data');
        this.setState({ orderDetail });
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('_refresh OrderDetail:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
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

  _putIntoShelf = () => {
    const { orderDetail, orderCode, qrData } = this.state;

    const hubCode = _.get(orderDetail, "pickupHub.code");
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
    const { orderDetail } = this.state;
    const orderCode = _.get(orderDetail, "orderCode");
    const hubCode = _.get(orderDetail, "pickupHub.code");
    
    LoggerUtils.log('_acceptOrder', 'orderCode', orderCode, 'hubCode', hubCode);
    OrderService.atHub(orderCode, hubCode).then(response => {
      LoggerUtils.log('_acceptOrder:: atHub', 'data', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        this._refresh();
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('_acceptOrder:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
      }
    });
  }

  _handover = () => {
    const { orderDetail } = this.state;

    const hubCode = _.get(orderDetail, "pickupHub.code");
    const boxCode = _.get(orderDetail, 'pickupHub.boxInfo.code');
    const orderCode = _.get(orderDetail, "orderCode");
    
    LoggerUtils.log('_handover', 'hubCode', hubCode, 'boxCode', boxCode, 'orderCode', orderCode);
    
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
    const { showStampScanner, showShelfScanner } = this.state;
    LoggerUtils.log('render OrderDetail', 'showStampScanner', showStampScanner, 'showShelfScanner', showShelfScanner);
    if(showStampScanner) {
      return this._renderStampScanner();
    }
    if(showShelfScanner) {
      return this._renderShelfScanner();
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

  _renderMainScreen() {
    const { orderDetail } = this.state;
    const { ACTION_SCAN_STAMP, ACTION_PUT_INTO_SHELF } = this.options;
    
    const canAssignStamp = this._canAssignStamp(orderDetail);
    const canPutIntoShelf = this._canPutIntoShelf(orderDetail);
    const canAcceptOrder = this._canAcceptOrder(orderDetail);
    const canHandover = this._canHandover(orderDetail);
    
    LoggerUtils.log('_renderMainScreen', 
      'canAssignStamp', canAssignStamp, 
        'canPutIntoShelf', canPutIntoShelf, 
          'canAcceptOrder', canAcceptOrder,
            'canHandover', canHandover);

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
                canAssignStamp && 
                (
                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <TouchableWithoutFeedback onPress={() => this._showScanner(ACTION_SCAN_STAMP) }>
                      <IconNB name="qr-scanner" color="#000" size={24} />
                    </TouchableWithoutFeedback>
                  </View>
                )
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
                  <Text>{_.get(orderDetail, 'pickupHub.boxInfo.code')}</Text>
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
        { canAcceptOrder && 
          (
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
        { canHandover && 
          (
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