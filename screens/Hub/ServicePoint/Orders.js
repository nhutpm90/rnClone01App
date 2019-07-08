import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback,
  ActivityIndicator, RefreshControl } from "react-native";

import { Container, Header, Title, Subtitle, Content, Button, Icon as IconNB, Left, Right, Body } from "native-base";

import _ from 'lodash';

import { NavigationUtils, LoggerUtils } from '../utils/Utils';

import OrderService from './../services/OrderService';

export default class App extends Component {

  constructor(props) {
    super(props);
    
    const { navigation } = props;
    const boxId = navigation.getParam('boxId', '');

    LoggerUtils.log('init Orders', 'boxId', boxId);

    this.state = {
      refreshing: false,
      boxId,
      orders: []
    };
  }

  componentDidMount() {
    LoggerUtils.log('componentDidMount');
    this._refresh();
  }

  _refresh = () => {
    this.setState({ refreshing: true });
    const { boxId } = this.state;
    LoggerUtils.log('_refresh Orders', 'boxId', boxId);
    
    OrderService.ordersByBoxId(boxId).then(response => {
      LoggerUtils.log('ordersByBoxId', 'boxId', boxId, 'response', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        const box = _.get(response, 'data.data');
        const orders = box.orderCodes;
        this.setState({ orders, refreshing: false });
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('ordersByBoxId:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
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
    LoggerUtils.log("onRefresh Orders");
    this._refresh();
  }

  render() {
    LoggerUtils.log('render Orders');
    let { refreshing, orders } = this.state;
    const { navigation } = this.props;

    // if(orders != undefined && orders != null && orders.length >0) {
    //   orders = [orders[0], orders[1]];
    // }
    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => NavigationUtils.goBack(navigation)}>
              <IconNB name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>Danh sách đơn hàng</Title>
            {/* <Subtitle>Subtitle</Subtitle> */}
          </Body>
          <Right style={{flex: 1}}>
            <Button transparent onPress={this._refresh} >
              <IconNB name="refresh" />
            </Button>
          </Right>
        </Header>
        <Content style={{ backgroundColor: "#E3E8EB" }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>
            <FlatList contentContainerStyle={{margin: 16, backgroundColor: '#FFFFFF'}}
              data={orders}
              ItemSeparatorComponent={() => (
                <View style={{ 
                  height: 0.5,
                  backgroundColor: "#DCE1E5",
                  marginHorizontal: 16
                }} />
              )}
              
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
        </Content>
      </Container>
    );
  }
}