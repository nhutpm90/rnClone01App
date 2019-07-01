import React, { Component } from "react";

import { createStackNavigator, createAppContainer } from "react-navigation";

import { Root, Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text, ListItem, List } from "native-base";

import Boxes from './Boxes';
import Orders from './Orders';
import OrderDetail from './OrderDetail';

import AccountService from './services/AccountService';
import OrderService from './services/OrderService';

import AsyncStorage from "@react-native-community/async-storage";


const RootStack = createStackNavigator(
  {
    Boxes: {
      screen: Boxes,
    },
    Orders: {
      screen: Orders,
    },
    OrderDetail: {
      screen: OrderDetail,
    }
  },
  {
    initialRouteName: 'Boxes',
    headerMode: 'none',
  }
)

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {

  constructor(props) {
    super(props);
    
    // AccountService.login("0938674470", "123456");

    // AsyncStorage.setItem("abc", "1234");
    // AsyncStorage.getItem("user").then((value) => console.log("value11111:: " + value));

    OrderService.orderDetail(2648);
  }

  render() {
    return (
      <Root>
        <AppContainer />
      </Root>
    );
  }
}