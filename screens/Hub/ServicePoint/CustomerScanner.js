import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert, Vibration } from "react-native";

import { Container, Header, Title, Subtitle, Content, Item, Form, 
  Text as TextNB, Input, Button, Icon as IconNB, Left, Right, Body, Footer, FooterTab, Badge, H3 } from "native-base";

import { NavigationUtils, LoggerUtils } from '../utils/Utils';

import CodeScanner from '../components/CodeScanner';

import OrderService from '../services/OrderService';

export default class App extends Component {

  constructor(props) {
    LoggerUtils.log('init Customer Scanner');
    super(props);

    this.state = {
      qrData: '',
      // qrData: 'ILG004770', // debug code
    };

    this.options = {
      
    };
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
    this.setState({ qrData: data});
  }

  _showOrderDetail = () => {
    const { qrData } = this.state;
    const { navigation } = this.props;
    LoggerUtils.log('_showOrderDetail', 'orderCode', qrData);
    NavigationUtils.navigateToOrderDetailScreen(navigation, qrData);
  }
  
  componentDidMount() {
    LoggerUtils.log('componentDidMount Customer Scanner');
     // debug code start
     OrderService.getLatestOrder((orderCode) => {
      LoggerUtils.log('getLatestOrder', 'orderCode', orderCode);
      this.setState({ qrData: orderCode });
    });
    // debug code end
  }

  render() {
    LoggerUtils.log('render Customer Scanner');
    const { qrData } = this.state;
    const { navigation } = this.props;
    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => NavigationUtils.goBack(navigation)}>
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
                     onChangeText={text => this._updateValue("qrData", text)} >{qrData}</Input>
                </Item>
                <Item>
                  <Button onPress={this._showOrderDetail}>
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
}