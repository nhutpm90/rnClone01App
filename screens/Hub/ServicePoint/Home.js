import React, { Component } from "react";

import { createStackNavigator, createAppContainer } from "react-navigation";

import { Root, Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text, ListItem, List } from "native-base";

import Boxes from './Boxes';

const RootStack = createStackNavigator(
  {
    Boxes: {
      screen: Boxes,
    },
  },
  {
    initialRouteName: 'Boxes',
    headerMode: 'none',
  }
)

export default RootStack;

// const AppContainer = createAppContainer(RootStack);

// export default class App extends React.Component {

//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <Root>
//         <AppContainer />
//       </Root>
//     );
//   }
// }