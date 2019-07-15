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
    const hub = navigation.getParam('hub', '');
    LoggerUtils.log('init InputOTP', 'hub', JSON.stringify(hub));

    this.state = {
      hub,
      // orderDetail: {},
      otp: '277136',
    };
  }
  
  componentDidMount() {
    LoggerUtils.log('componentDidMount InputOTP');
  }

  _updateValue(field, text) {
    LoggerUtils.log('_updateValue', field, text);
    const newData = {};
    newData[field] = text;
    this.setState(newData);
  }

  _verifyOTP = () => {
    const { hub, otp } = this.state;
    const hubCode = _.get(hub, 'code');
    LoggerUtils.log('_verifyOTP', 'hubCode', hubCode, 'OTP', otp);

    HubService.verifyOTP(hubCode, otp).then(response => {
      LoggerUtils.log('verifyOTP', 'hubCode', hubCode, 'otp', otp,
        'response', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        const orderDetail = _.get(response, 'data.data');
        this.setState({ orderDetail });
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('verifyOTP:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
        this.setState({ orderDetail: undefined });
      }
    });
  }

  _onItemClicked = () => {
    const { orderDetail } = this.state;
    const { navigation } = this.props;
    const orderCode = _.get(orderDetail, 'orderCode');
    LoggerUtils.log('_onItemClicked', 'orderCode', orderCode);
    NavigationUtils.navigateToOrderDetailScreen(navigation, orderCode, true);
  }

  render() {
    LoggerUtils.log('render InputOTP');
    const { orderDetail, otp } = this.state;

    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => NavigationUtils.goBack(this.props.navigation)}>
              <IconNB name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>OTP</Title>
          </Body>
          <Right style={{flex: 1}}>
            
          </Right>
        </Header>
        <Content padder style={{ backgroundColor: "#FFF" }}>
          <Form>
            <Item>
              <Input onChangeText={text => this._updateValue("otp", text)}
                placeholder="Nhập mã OTP" 
                keyboardType="number-pad"
                onSubmitEditing={this._verifyOTP}>{otp}</Input>
              <TouchableWithoutFeedback>
                <IconNB active name="search" onPress={this._verifyOTP}/>
              </TouchableWithoutFeedback>
            </Item>
          </Form>
          { orderDetail != undefined && (
            <TouchableWithoutFeedback onPress={this._onItemClicked}>
              <View style={{ 
                flex: 1,
                flexDirection: "row",
                backgroundColor: "#FFFFFF",
                paddingVertical: 6,
                marginTop: 5,
                borderWidth: 1,
              }} >
                <View style={{ 
                  flex: 1,
                  justifyContent: "center",
                  // backgroundColor: "yellow",
                }} >
                  <Text>{_.get(orderDetail, 'orderCode')}</Text>
                  <Text>{`Kệ: ${_.get(orderDetail, 'boxCode')}`}</Text>
                  <Text>{`Kích cỡ: ${_.get(orderDetail, 'parcelSize')}`}</Text>
                </View>
                <View style={{ 
                  flex: 1,
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  // backgroundColor: "blue",
                }} >
                  <Text>Trạng Thái</Text>
                  <Text>{_.get(orderDetail, 'orderStatus')}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        </Content>
      </Container>
    );
  }
}

// {
//   "success": true,
//   "data": {
//       "token": "231742",
//       "orderCode": "ILG004808",
//       "hubCode": "HQ3-01",
//       "boxId": 19,
//       "boxCode": "C01",
//       "driverBoard": "B-VO VAN TAN",
//       "createDate": 1562485811000,
//       "usedDate": null,
//       "usedBy": "0909795262",
//       "orderId": 4808,
//       "orderStatus": "FO_AT_HUB_FOR_COLLECTION",
//       "parcelSize": "SMALL_SIZED",
//       "phoneNumber": null,
//       "active": false
//   }
// }