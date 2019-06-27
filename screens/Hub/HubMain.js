import React, { Component } from "react";

import { createStackNavigator, createAppContainer } from "react-navigation";

import { Root, Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text, ListItem, List } from "native-base";

import Boxes from './Boxes';
import Orders from './Orders';

const RootStack = createStackNavigator(
  {
    Boxes: {
      screen: Boxes,
    },
    Orders: {
      screen: Orders,
    }
  },
  {
    initialRouteName: 'Boxes',
    headerMode: 'none',
  }
)

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <AppContainer />
      </Root>
    );
  }
}