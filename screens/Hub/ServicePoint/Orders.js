import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback } from "react-native";

import { Container, Header, Title, Subtitle, Content, Button, Icon, Left, Right, Body } from "native-base";

import _ from 'lodash';

import { NavigationUtils, LoggerUtils } from '../utils/Utils';

import OrderService from './../services/OrderService';

class OrderList extends Component {

  constructor(props) {
    super(props);
    LoggerUtils.log('init OrderList');
  }
  
  _getData() {
    const { orders } = this.props;
    return orders;
  }

  render() {
    LoggerUtils.log('render OrderList');
    const data = this._getData();

    return (
      <View style={{ flex: 1, }} >
        <FlatList contentContainerStyle={{margin: 16, backgroundColor: '#FFFFFF'}}
          data={data}
          ItemSeparatorComponent={() => (
            <View style={{ 
              height: 0.5,
              backgroundColor: "#DCE1E5",
              marginHorizontal: 16
            }} />
          )}
          keyExtractor={(item, index) => item.orderCode.toString()}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback onPress={() => alert('on press:: orderCode - '+ item.orderCode)}>
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
}

export default class App extends Component {

  constructor(props) {
    super(props);
    
    const { navigation } = props;
    const boxId = navigation.getParam('boxId', '');

    LoggerUtils.log('init Orders', 'boxId', boxId);

    this.state = {
      boxId,
      orders: []
    };
  }

  componentDidMount() {
    LoggerUtils.log('componentDidMount');
    this._refresh();
  }

  _refresh = () => {
    const { boxId } = this.state;
    LoggerUtils.log('_refresh', 'boxId', boxId);
    OrderService.ordersByBoxId(boxId).then(response => {
      const data = response.data;
      LoggerUtils.log('ordersByBoxId', 'boxId', JSON.stringify(data));
      const success = data.success;
      if(success == true) {
        const box = data.data;
        const orders = box.orderCodes;
        this.setState({ orders });
      }
    });
  }

  render() {
    LoggerUtils.log('render Orders');
    const { orders } = this.state;
    const { navigation } = this.props;

    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => NavigationUtils.goBack(navigation)}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>Danh sách đơn hàng</Title>
          </Body>
          <Right style={{flex: 1}}>
            
          </Right>
        </Header>
        <Content style={{ backgroundColor: "#E3E8EB" }}>
          <OrderList {...this.props} orders={orders} />
        </Content>
      </Container>
    );
  }
}