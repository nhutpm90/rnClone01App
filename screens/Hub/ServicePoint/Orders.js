import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback } from "react-native";

import { Container, Header, Title, Subtitle, Content, Button, Icon, Left, Right, Body } from "native-base";

import _ from 'lodash';

import OrderService from './../services/OrderService';

class OrderList extends Component {

  // _getData() {
  //   const data = [];
  //   const dataTemplate = {
  //     id: "",
  //     name: "Lorem ipsum dolor sit amet",
  //     imageUrl: "https://cdn.dribbble.com/users/1236180/screenshots/4440250/shot.jpg",
  //     description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo"
  //   };

  //   for (var i = 0; i < 2; i++) {
  //     data.push({ ...dataTemplate, id: i, name: "Order "+(i+1) });
  //   }
  //   return data;
  // }

  _getData() {
    const { orders } = this.props;
    return orders;
  }

  render() {
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
    console.log(`init orders:: boxId['${boxId}']`);

    this.state = {
      boxId,
      orders: []
    };
  }

  componentDidMount() {
    this._refresh();
  }

  _refresh = () => {
    const { boxId } = this.state;
    console.log(`_refresh:: boxId['${boxId}']`);
    OrderService.ordersByBoxId(boxId).then(response => {
      console.log(`_refresh:: ordersByBoxId:: response['${JSON.stringify(response)}']`);
      const data = response.data;
      const success = data.success;
      if(success == true) {
        const box = data.data;
        const orders = box.orderCodes;
        this.setState({ orders });
      }
    });
  }

  render() {
    const { orders } = this.state;
    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
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