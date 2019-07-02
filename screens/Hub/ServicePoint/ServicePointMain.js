import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { Root } from "native-base";

import { createAppContainer, createBottomTabNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";

import Home from "./Home";
import Account from "./Account";

const RootStack = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        title: "HOME",
        tabBarIcon: ({ horizontal, tintColor }) => (
          <Icon name="ios-home" color={tintColor} size={24} />
        )
      }
    },
    Account: {
      screen: Account,
      navigationOptions: {
        title: "ACCOUNT",
        tabBarIcon: ({ horizontal, tintColor }) => (
          <Icon name="ios-person" color={tintColor} size={24} />
        )
      }
    }
  },
  {
    initialRouteName: "Home",
    tabBarOptions: {
      activeTintColor: "#00b14f",
      inactiveTintColor: "#9a9a9a",
      style: {
        backgroundColor: "white",
        borderTopWidth: 0,
        shadowOffset: { width: 5, height: 3 },
        shadowColor: "black",
        shadowOpacity: 0.5,
        elevation: 5
      }
    }
  }
);

export default RootStack;

// const AppContainer = createAppContainer(RootStack);

// export default class App extends React.Component {
//   render() {
//     return (
//       <Root>
//         <AppContainer />
//       </Root>
//     );
//   }
// }