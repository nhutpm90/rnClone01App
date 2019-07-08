import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { Root } from "native-base";

import { createAppContainer, createBottomTabNavigator, createStackNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";

import Home from "./Home";
import Account from "./Account";
import Boxes from './Boxes';
import Orders from './Orders';
import OrderDetail from './OrderDetail';

import CustomerScanner from './CustomerScanner';
import DriverScanner from './DriverScanner';
import DriverOrders from './DriverOrders';

import QRCodeGenerator from '../components/QRCodeGenerator';

import InputOTP from './InputOTP';

const rootTab = createBottomTabNavigator(
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

const MainStack = createStackNavigator(
  {
    Boxes: {
      screen: Boxes,
    },
    Orders: {
      screen: Orders,
    },
    OrderDetail: {
      screen: OrderDetail,
    },
    DriverOrders: {
      screen: DriverOrders,
    },
    rootTab: {
      screen: rootTab,
    },
  },
  {
    initialRouteName: 'rootTab',
    headerMode: 'none',
  }
)

const RootStack = createStackNavigator(
  {
    MainStack: {
      screen: MainStack,
    },
    CustomerScanner: {
      screen: CustomerScanner
    },
    DriverScanner: {
      screen: DriverScanner
    },
    QRCodeGenerator: {
      screen: QRCodeGenerator
    },
    InputOTP: {
      screen: InputOTP,
    },
  },
  {
    initialRouteName: 'MainStack',
    mode: 'modal',
    headerMode: 'none',
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