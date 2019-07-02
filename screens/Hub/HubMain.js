import React from "react";

import { createStackNavigator, createAppContainer } from "react-navigation";

import { Root } from "native-base";

import Login from './Login';

import Boxes from './ServicePoint/Boxes';
import Orders from './ServicePoint/Orders';
import OrderDetail from './ServicePoint/OrderDetail';

import ServicePointMain from "./ServicePoint/ServicePointMain";

const RootStack = createStackNavigator(
  {
    Login: {
      screen: Login,
    },
    ServicePointMain: {
      screen: ServicePointMain,
    },
    Orders: {
      screen: Orders,
    },
    OrderDetail: {
      screen: OrderDetail,
    }
  },
  {
    initialRouteName: 'Login',
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